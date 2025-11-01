const joi = require("joi");

const createStoreSchema = joi.object({
  name: joi.string().min(2).max(200).required(),
  slug: joi
    .string()
    .regex(/^[a-z0-9\-]+$/i)
    .required(),
  description: joi.string().max(2000).optional().allow(""),
  category: joi.string().optional(),
  tags: joi
    .alternatives()
    .try(joi.array().items(joi.string()), joi.string())
    .optional(),
  phone: joi.string().optional().allow(""),
  email: joi.string().email().optional().allow(""),
  website: joi.string().uri().optional().allow(""),
  location: joi
    .object({
      type: joi.string().valid("Point").required(),
      coordinates: joi.array().items(joi.number()).length(2).required(),
    })
    .optional(),
});

const updateStoreSchema = createStoreSchema.fork(["name", "slug"], (s) =>
  s.optional()
);

exports.validateCreateStore = (data) =>
  createStoreSchema.validate(data, { abortEarly: false });
exports.validateUpdateStore = (data) =>
  updateStoreSchema.validate(data, { abortEarly: false });
