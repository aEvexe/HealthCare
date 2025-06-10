const Joi = require("joi");

const reviewSchema = Joi.object({
  rating: Joi.string().max(50),
  comment: Joi.string().max(100),
  created_at: Joi.string().required(),
  updated_at: Joi.string().required(),
  clientId: Joi.number().integer(),
  serviceId: Joi.number().integer()
});

module.exports = { reviewSchema };
