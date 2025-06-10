const Joi = require("joi");

const adminSchema = Joi.object({
  name: Joi.string().max(50).required(),

  email: Joi.string()
    .email()
    .max(100)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  is_active: Joi.boolean().optional(), 

  created_at: Joi.string().optional(), 
});

module.exports = {adminSchema}