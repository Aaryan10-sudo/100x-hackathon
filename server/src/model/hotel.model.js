const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true,enum: ["Single", "Double", "Suite", "Deluxe"] }, // e.g., Deluxe Room            
  description: { type: String },
  pricePerNight: { type: Number, required: true },
  maxOccupancy: { type: Number, default: 2 },
  available: { type: Boolean, default: true },
  images: [String],                                
});

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    location: {
      city: { type: String },
      country: { type: String, default: "Nepal" },
      address: { type: String },
      coordinates: {                                // optional, for maps
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    images: [String],                               // Cloudinary URLs for hotel
    amenities: [String],                            // e.g., WiFi, Pool, Breakfast
    rooms: [roomSchema],                            // Embed rooms
    rating: { type: Number, default: 0 },           // Average rating
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
