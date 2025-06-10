const Joi = require('joi');

const clientSchema = Joi.object({
  full_name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  passport_number: Joi.string().optional().allow(null, ''),
  phone: Joi.string().optional().allow(null, ''),
  birth_date: Joi.string().optional().allow(null, ''),
  address: Joi.string().optional().allow(null, ''),
  password: Joi.string().min(6).max(50).required(),
});

module.exports = { clientSchema };
