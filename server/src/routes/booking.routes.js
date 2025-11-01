const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
} = require("../controller/booking.controller");

// Create booking (authenticated users)
router.post("/", auth, createBooking);

// List bookings (admins could query all; users can pass ?user=)
router.get("/", auth, getBookings);

router.get("/:id", auth, getBookingById);
router.post("/:id/cancel", auth, cancelBooking);

module.exports = router;
