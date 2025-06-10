const Joi = require("joi");

const paymentSchema = Joi.object({
  amount: Joi.string().max(50),
  payment_date: Joi.string(),
  payment_method: Joi.string(),
  contractId: Joi.number(),
  statusId: Joi.number()
});

module.exports = { paymentSchema };
