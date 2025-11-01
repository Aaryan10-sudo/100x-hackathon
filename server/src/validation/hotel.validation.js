const joi = require("joi");
const hotelValidationSchema = joi.object({
  name: joi.string().min(3).max(100).required(),
  address: joi.string().min(10).max(200).required(),
  city: joi.string().min(2).max(100).required(),
  country: joi.string().min(2).max(100).required(),
  description: joi.string().max(500).optional(),
  images: joi.array().items(joi.string().uri()).optional(),
  amenities: joi.array().items(joi.string()).optional(),
  rooms: joi.array().items(
    joi.object({
      name: joi.string().valid("Single", "Double", "Suite", "Deluxe").required(),
      description: joi.string().max(500).optional(),
      pricePerNight: joi.number().min(0).required(),
      maxOccupancy: joi.number().min(1).required(),
      available: joi.boolean().default(true),
      images: joi.array().items(joi.string().uri()).optional(),
    })
  ).optional(),
});
exports.validateHotel = (data) => {
  return hotelValidationSchema.validate(data);
}