const Joi = require("joi");

const ownerSchema = Joi.object({
  full_name: Joi.string().max(50).optional(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().optional(),
  password: Joi.string().min(6).max(30).required(),  
});

module.exports = { ownerSchema };

