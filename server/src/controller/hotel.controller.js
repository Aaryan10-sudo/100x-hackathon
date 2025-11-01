const Hotel = require("../model/hotel.model");
const { validateHotel } = require("../validation/hotel.validation");
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

// Helper: transform flat address fields into model.location structure
function buildLocationFromBody(body) {
  if (body.location && typeof body.location === "object") return body.location;
  const { address, city, country } = body;
  if (!address && !city && !country) return undefined;
  return {
    address: address || undefined,
    city: city || undefined,
    country: country || "Nepal",
  };
}

// Create a hotel hai kt lanu guys 
exports.createHotel = async (req, res) => {
  try {
    const { error } = validateHotel(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const location = buildLocationFromBody(req.body);

    const hotelData = {
      name: req.body.name,
      description: req.body.description,
      location,
      images: req.body.images || [],
      amenities: req.body.amenities || [],
      rooms: req.body.rooms || [],
    };

    const hotel = await Hotel.create(hotelData);
    try {
      await redisSet(`hotel:${hotel._id}`, hotel);
      await redisDelPattern("hotels:*");
    } catch (e) {
      // ignore cache errors
    }
    return res.status(201).json({ message: "Hotel created", hotel });
  } catch (err) {
    console.error("createHotel error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 9);
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.q) {
      // search by name (case-insensitive)
      filters.name = { $regex: req.query.q, $options: "i" };
    }
    if (req.query.city) {
      filters["location.city"] = {
        $regex: `^${req.query.city}$`,
        $options: "i",
      };
    }

    const cacheKey = `hotels:q=${req.query.q || ""}:city=${
      req.query.city || ""
    }:page=${page}:limit=${limit}`;
    const cached = await redisGet(cacheKey);
    if (cached) return res.json(cached);

    const [total, hotels] = await Promise.all([
      Hotel.countDocuments(filters),
      Hotel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ]);

    const payload = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
      hotels,
    };
    // cache list result
    await redisSet(cacheKey, payload);

    return res.json(payload);
  } catch (err) {
    console.error("getHotels error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get a single hotel by id
exports.getHotelById = async (req, res) => {
  try {
    const id = req.params.id;
    const cacheKey = `hotel:${id}`;
    const cached = await redisGet(cacheKey);
    if (cached) return res.json(cached);

    const hotel = await Hotel.findById(id).populate(
      "reviews.user",
      "name email"
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    await redisSet(cacheKey, hotel);
    return res.json(hotel);
  } catch (err) {
    console.error("getHotelById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update hotel (partial)
exports.updateHotel = async (req, res) => {
  try {
    const id = req.params.id;

    // If user passes full hotel payload, validate; if partial, skip strict validation
    if (
      req.body.name ||
      req.body.address ||
      req.body.city ||
      req.body.country
    ) {
      const { error } = validateHotel({
        name: req.body.name || "",
        address:
          req.body.address ||
          (req.body.location && req.body.location.address) ||
          "",
        city:
          req.body.city || (req.body.location && req.body.location.city) || "",
        country:
          req.body.country ||
          (req.body.location && req.body.location.country) ||
          "",
        description: req.body.description,
      });
      if (error)
        return res.status(400).json({ message: error.details[0].message });
    }

    const update = { ...req.body };
    const location = buildLocationFromBody(req.body);
    if (location) update.location = location;

    const hotel = await Hotel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    // update cache: single hotel + invalidate lists
    try {
      await redisSet(`hotel:${id}`, hotel);
      await redisDelPattern("hotels:*");
    } catch (e) {}
    return res.json({ message: "Hotel updated", hotel });
  } catch (err) {
    console.error("updateHotel error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    // invalidate cache
    try {
      await redisDelPattern(`hotel:${id}`);
      await redisDelPattern("hotels:*");
    } catch (e) {}
    return res.json({ message: "Hotel deleted" });
  } catch (err) {
    console.error("deleteHotel error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a review to a hotel
exports.addReview = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, comment, rating } = req.body;
    if (!userId || !rating)
      return res
        .status(400)
        .json({ message: "userId and rating are required" });

    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    hotel.reviews.push({ user: userId, comment, rating });
    // recalc average rating
    const sum = hotel.reviews.reduce((s, r) => s + (r.rating || 0), 0);
    hotel.rating = Math.round((sum / hotel.reviews.length) * 10) / 10; // one decimal
    await hotel.save();
    // invalidate cache for this hotel and lists
    try {
      await redisSet(`hotel:${id}`, hotel);
      await redisDelPattern("hotels:*");
    } catch (e) {}

    return res.status(201).json({ message: "Review added", hotel });
  } catch (err) {
    console.error("addReview error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
