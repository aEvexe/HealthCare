const { Op } = require("sequelize");
const Appointment = require("../models/appointment.model");
const Service = require("../models/services.model");
const Client = require("../models/client.model");
const Owner = require("../models/owner.model");
const Contract = require("../models/contract.model");

const getServicesUsedInDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        appointment_date: {
          [Op.between]: [from, to],
        },
      },
      include: [Service],
    });

    res.status(200).json({ appointments });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getClientsUsedServicesInDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const clients = await Client.findAll({
      include: [
        {
          model: Appointment,
          where: {
            appointment_date: {
              [Op.between]: [from, to],
            },
          },
        },
      ],
    });

    res.status(200).json({ clients });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getClientsCanceledInDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const clients = await Client.findAll({
      include: [
        {
          model: Appointment,
          where: {
            appointment_date: {
              [Op.between]: [from, to],
            },
            statusId: 3, // assuming 3 = canceled
          },
        },
      ],
    });

    res.status(200).json({ clients });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getTopOwnersByServiceName = async (req, res) => {
  try {
    const { serviceName } = req.query;

    const owners = await Owner.findAll({
      include: [
        {
          model: Service,
          where: { name: serviceName },
          include: [
            {
              model: Appointment,
            },
          ],
        },
      ],
    });

    res.status(200).json({ owners });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getPaymentsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const payments = await Contract.findAll({
      where: { clientId },
      include: [Service, Owner],
    });

    res.status(200).json({ payments });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  getServicesUsedInDateRange,
  getClientsUsedServicesInDateRange,
  getClientsCanceledInDateRange,
  getTopOwnersByServiceName,
  getPaymentsByClient,
};
