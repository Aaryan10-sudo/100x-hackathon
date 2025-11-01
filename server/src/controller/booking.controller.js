const mongoose = require("mongoose");
const Booking = require("../model/booking.model");
const Hotel = require("../model/hotel.model");
const { validateBooking } = require("../validation/booking.validation");
const { sendEmail } = require("../config/nodemailer");
const redisClient = require("../config/redis");

const CACHE_TTL = 60 * 5; // 5 minutes

async function redisGet(key) {
  try {
    if (!redisClient || typeof redisClient.get !== "function") return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn("redisGet failed", err?.message || err);
    return null;
  }
}

async function redisSet(key, value, ttl = CACHE_TTL) {
  try {
    if (!redisClient || typeof redisClient.set !== "function") return;
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.warn("redisSet failed", err?.message || err);
  }
}

async function redisDelPattern(pattern) {
  try {
    if (!redisClient || typeof redisClient.keys !== "function") return;
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length) await redisClient.del(...keys);
  } catch (err) {
    console.warn("redisDelPattern failed", err?.message || err);
  }
}

// Small HTML email template for booking confirmation
function bookingEmailTemplate({ booking, hotel, user }) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #4e54c8, #8f94fb); padding: 40px 0; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: #4e54c8; color: #fff; text-align: center; padding: 20px 30px;">
        <h1 style="margin: 0; font-size: 26px;">Booking Confirmation</h1>
        <p style="margin: 5px 0 0; font-size: 14px;">Your stay is confirmed 🎉</p>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 16px;">Hi <strong>${user.name || ""}</strong>,</p>
        <p style="font-size: 15px; color: #555;">Thank you for choosing <strong>${hotel.name}</strong>. Here are your booking details:</p>

        <table cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background: #f9f9f9;">
            <td style="font-weight: bold; width: 35%;">Hotel</td>
            <td>${hotel.name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Address</td>
            <td>${(hotel.location && (hotel.location.address || hotel.location.city)) || ""}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="font-weight: bold;">Room</td>
            <td>${booking.roomName || "Standard"}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Check-in</td>
            <td>${new Date(booking.checkIn).toLocaleString()}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="font-weight: bold;">Check-out</td>
            <td>${new Date(booking.checkOut).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Guests</td>
            <td>${booking.guests}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="font-weight: bold;">Total</td>
            <td><strong>${booking.totalPrice} ${booking.currency || "USD"}</strong></td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Status</td>
            <td style="color: ${booking.status === "Confirmed" ? "green" : "orange"};"><strong>${booking.status}</strong></td>
          </tr>
        </table>

        <div style="margin-top: 25px; text-align: center;">
          <a href="#" style="background: #4e54c8; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Booking</a>
        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #777;">
          Need to make changes or cancel your booking? Just reply to this email or contact our support team.
        </p>

        <p style="margin-top: 20px; font-size: 15px;">Safe travels,<br><strong>The Travel Team</strong></p>
      </div>
    </div>
  </div>
  `;
}


// Create booking
exports.createBooking = async (req, res) => {
  try {
    // Validate incoming booking payload (contactEmail is required)
    const { error } = validateBooking(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const data = req.body;

    // Fast-fail if DB is not connected
    if (mongoose.connection.readyState !== 1) {
      // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
      return res
        .status(503)
        .json({ message: "Service unavailable: database not connected" });
    }

    // Validate hotel exists (we still need hotel data for email and booking integrity)
    const hotel = await Hotel.findById(data.hotel).lean();
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Determine user id (if present in request or via body). We avoid loading full user to keep request fast.
    const userId = (req.user && req.user.id) || data.user || null;
    const contactEmail = data.contactEmail; // required by validation

    // Acquire a short Redis lock to prevent concurrent bookings for same hotel/room/date
    const lockKey = `booking:lock:${data.hotel}:${
      data.roomName || "any"
    }:${new Date(data.checkIn).toISOString()}:${new Date(
      data.checkOut
    ).toISOString()}`;
    let lockAcquired = false;
    try {
      if (redisClient && typeof redisClient.set === "function") {
        const setResult = await redisClient.set(lockKey, "1", {
          NX: true,
          EX: 30,
        });
        if (!setResult) {
          return res.status(409).json({
            message:
              "Another booking is being processed for these dates. Try again.",
          });
        }
        lockAcquired = true;
      }

      const bookingPayload = {
        user: userId,
        hotel: data.hotel,
        roomName: data.roomName,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        totalPrice: data.totalPrice,
        currency: data.currency,
        payment: data.payment,
        contactEmail: contactEmail,
      };

      const booking = await Booking.create(bookingPayload);

      // cache created booking and invalidate bookings lists
      try {
        await redisSet(`booking:${booking._id}`, booking);
        await redisDelPattern("bookings:*");
      } catch (e) {}

      // send confirmation email synchronously (must succeed or be queued)
      const emailPayload = {
        type: "booking_confirmation",
        to: contactEmail,
        subject: `Booking confirmation - ${hotel.name}`,
        html: bookingEmailTemplate({
          booking,
          hotel,
          user: { name: bookingPayload.name || "Guest" },
        }),
        bookingId: booking._id,
        createdAt: new Date().toISOString(),
      };

      try {
        const result = await sendEmail({
          from: process.env.SMTP_USER,
          to: emailPayload.to,
          subject: emailPayload.subject,
          html: emailPayload.html,
        });
        console.log("Booking confirmation email sent to", emailPayload.to);
        if (result && result.preview)
          console.log("Ethereal preview URL:", result.preview);
        return res
          .status(201)
          .json({
            message: "Booking created",
            booking,
            emailSent: true,
            preview: result && result.preview,
          });
      } catch (err) {
        console.warn("Booking email send failed:", err?.message || err);
        // try to queue
        let queued = false;
        try {
          if (redisClient && typeof redisClient.rPush === "function") {
            await redisClient.rPush(
              "email_queue",
              JSON.stringify(emailPayload)
            );
            queued = true;
          }
        } catch (qe) {
          console.error("Failed to enqueue email payload", qe?.message || qe);
        }

        if (queued) {
          return res
            .status(201)
            .json({
              message: "Booking created (email queued)",
              booking,
              emailSent: false,
              queued: true,
            });
        }

        // if we couldn't send or queue the email, rollback booking to respect "email required"
        try {
          await Booking.findByIdAndDelete(booking._id);
        } catch (delErr) {
          console.error(
            "Failed to rollback booking after email failure:",
            delErr?.message || delErr
          );
        }
        return res
          .status(502)
          .json({
            message: "Booking failed: confirmation email could not be sent",
            error: err?.message || String(err),
          });
      }
    } finally {
      try {
        if (
          lockAcquired &&
          redisClient &&
          typeof redisClient.del === "function"
        ) {
          await redisClient.del(lockKey);
        }
      } catch (e) {
        console.warn("failed to release booking lock", e?.message || e);
      }
    }
  } catch (err) {
    console.error("createBooking error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// List bookings (admin or user) - if query ?user=ID returns that user's bookings
exports.getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;
    if (req.query.hotel) filter.hotel = req.query.hotel;

    const cacheKey = `bookings:user=${req.query.user || ""}:hotel=${
      req.query.hotel || ""
    }`;
    const cached = await redisGet(cacheKey);
    if (cached) return res.json({ bookings: cached });

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("hotel user", "name email");
    await redisSet(cacheKey, bookings);
    return res.json({ bookings });
  } catch (err) {
    console.error("getBookings error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const cacheKey = `booking:${req.params.id}`;
    const cached = await redisGet(cacheKey);
    if (cached) return res.json({ booking: cached });

    const booking = await Booking.findById(req.params.id).populate(
      "hotel user",
      "name email"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await redisSet(cacheKey, booking);
    return res.json({ booking });
  } catch (err) {
    console.error("getBookingById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "hotel user",
      "name email"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "cancelled";
    await booking.save();

    // send cancellation email, fallback to queue on failure
    let emailStatus = { sent: false };
    try {
      const to = (booking.user && booking.user.email) || booking.contactEmail;
      const name = (booking.user && booking.user.name) || "Guest";
      const html = `
        <div><p>Hi ${name},</p>
        <p>Your booking at <strong>${booking.hotel.name}</strong> has been cancelled.</p>
        <p>Booking id: ${booking._id}</p>
        </div>`;
      if (to) {
        await sendEmail({
          from: process.env.SMTP_USER,
          to,
          subject: `Booking cancelled - ${booking.hotel.name}`,
          html,
        });
        emailStatus.sent = true;
      } else {
        emailStatus.sent = false;
        emailStatus.error = "No recipient email available";
      }
    } catch (e) {
      const errMsg = e?.message || String(e);
      console.warn("cancellation email failed", errMsg);
      try {
        if (redisClient && typeof redisClient.rPush === "function") {
          const payload = {
            type: "booking_cancellation",
            to: (booking.user && booking.user.email) || booking.contactEmail,
            subject: `Booking cancelled - ${booking.hotel.name}`,
            html: `<div><p>Hi ${
              (booking.user && booking.user.name) || "Guest"
            },</p><p>Your booking at <strong>${
              booking.hotel.name
            }</strong> has been cancelled.</p><p>Booking id: ${
              booking._id
            }</p></div>`,
            bookingId: booking._id,
            createdAt: new Date().toISOString(),
          };
          await redisClient.rPush("email_queue", JSON.stringify(payload));
          emailStatus.queued = true;
        }
      } catch (qe) {
        console.warn("failed to queue cancellation email", qe?.message || qe);
        emailStatus.queued = false;
      }
      emailStatus.error = errMsg;
    }

    // update cache and invalidate lists
    try {
      await redisSet(`booking:${booking._id}`, booking);
      await redisDelPattern("bookings:*");
    } catch (e) {}
    return res.json({ message: "Booking cancelled", booking, emailStatus });
  } catch (err) {
    console.error("cancelBooking error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
