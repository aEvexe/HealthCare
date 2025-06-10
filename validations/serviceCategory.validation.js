const Joi = require("joi");

const serviceCatSchema = Joi.object({
  name: Joi.string().max(50).required(),
  desc: Joi.string().max(100).required(),
});

module.exports = { serviceCatSchema };
