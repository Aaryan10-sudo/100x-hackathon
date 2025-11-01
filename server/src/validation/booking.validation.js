const joi = require("joi");

const bookingSchema = joi.object({
  // user is optional: if provided it should be a Mongo id; anon bookings allowed if contactEmail provided
  user: joi.string().hex().length(24).optional(),
  hotel: joi.string().hex().length(24).required(),
  roomName: joi.string().max(200).optional(),
  checkIn: joi.date().iso().required(),
  checkOut: joi.date().iso().greater(joi.ref("checkIn")).required(),
  guests: joi.number().min(1).max(20).default(1),
  totalPrice: joi.number().min(0).required(),
  currency: joi.string().length(3).optional(),
  contactEmail: joi.string().email().required(),
  payment: joi
    .object({
      method: joi.string().optional(),
      transactionId: joi.string().optional(),
    })
    .optional(),
});

exports.validateBooking = (data) => bookingSchema.validate(data);
