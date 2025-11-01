const mongoose = require("mongoose");

const openingSchema = new mongoose.Schema(
  {
    day: String,
    open: String,
    close: String,
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const storeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  category: { type: String, index: true },
  tags: [String],
  phone: String,
  email: String,
  website: String,
  languages: [String],
  priceRange: { type: String, enum: ["$", "$$", "$$$"], default: "$" },
  address: {
    street: String,
    city: String,
    region: String,
    country: String,
    postalCode: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
  },
  gallery: [{ url: String, publicId: String, alt: String }],
  openingHours: [openingSchema],
  amenities: [String],
  isFeatured: { type: Boolean, default: false },
  featuredUntil: Date,
  ratingAvg: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  contactPreferences: {
    contactForm: { type: Boolean, default: true },
    phone: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
  meta: {
    title: String,
    description: String,
  },
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    leads: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Store", storeSchema);
