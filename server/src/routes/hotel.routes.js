const express = require("express");
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  addReview,
} = require("../controller/hotel.controller");
const auth = require("../middleware/auth");
const hotelRouter = express.Router();

hotelRouter.post("/", auth, createHotel);
hotelRouter.get("/", auth, getHotels);
hotelRouter.get("/:id", auth, getHotelById);
hotelRouter.put("/:id", auth, updateHotel);
hotelRouter.delete("/:id", auth, deleteHotel);
hotelRouter.post("/:id/reviews", auth, addReview);
module.exports = hotelRouter;
