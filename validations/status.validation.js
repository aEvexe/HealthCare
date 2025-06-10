const Joi = require("joi");

const statusSchema = Joi.object({
  name: Joi.string().max(50).required(),
  type: Joi.string().max(100).required(),
});

module.exports = { statusSchema };
