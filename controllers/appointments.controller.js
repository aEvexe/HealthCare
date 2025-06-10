const Appointment = require("../models/appointment.model");
const Client = require("../models/client.model");
const Service = require("../models/services.model");
const Status = require("../models/status.model");
const { appointmentSchema } = require("../validations/appointments.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");

const createAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const client = await Client.findByPk(value.clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const service = await Service.findByPk(value.serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const status = await Status.findByPk(value.statusId);
    if (!status) return res.status(404).json({ message: "Status not found" });

    const newAppointment = await Appointment.create(value);
    res.status(201).json({ message: "Appointment created", newAppointment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllAppointments = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const appointments = await Appointment.findAll({
      limit,
      offset: (offset - 1) * limit,
      include: [Client, Service, Status],
    });

    res.status(200).json({ appointments });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id, {
      include: [Client, Service, Status],
    });

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ appointment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Appointment.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    const updatedAppointment = await Appointment.findByPk(id);
    res.status(200).json({ message: "Appointment updated", updatedAppointment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
