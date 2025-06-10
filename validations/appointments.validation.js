const Joi = require("joi");

const appointmentSchema = Joi.object({
  appointment_date: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
  clientId: Joi.number().integer(),
  serviceId: Joi.number().integer(),
  statusId: Joi.number().integer()
});

module.exports = { appointmentSchema };
