const Joi = require("joi");

const serviceSchema = Joi.object({
  price: Joi.string().max(50),
  duration: Joi.string().max(100),
  ownerId: Joi.number().integer(),
  ServiceCatId: Joi.number().integer(),
  created_at: Joi.string().optional(), 
});

module.exports = {
  serviceSchema,
};
