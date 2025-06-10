const Joi = require("joi");

const contractSchema = Joi.object({
  contract_date: Joi.string(),
  updated_at: Joi.string(),
  clientId: Joi.number(),
  serviceId: Joi.number(),
  adminId: Joi.number(),
  ownerId: Joi.number(),
  statusId: Joi.number()
});

module.exports = { contractSchema };
