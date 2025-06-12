const { Op } = require("sequelize");
const Appointment = require("../models/appointment.model");
const Service = require("../models/services.model");
const Client = require("../models/client.model");
const Owner = require("../models/owner.model");
const Contract = require("../models/contract.model");
const ServiceCat = require("../models/serviceCategory.model");
const { Sequelize } = require("sequelize");

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
    sendErrorResponse(error, res, 400);
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
    sendErrorResponse(error, res, 400);
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
            statusId: 1, // assuming 3 = canceled
          },
        },
      ],
    });

    res.status(200).json({ clients });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getTopOwnersByService = async (req, res) => {
  try {
    const serviceName = req.query.name;

    if (!serviceName) {
      return res.status(400).json({ message: "Service name is required" });
    }

    const results = await Appointment.findAll({
      attributes: [
        [Sequelize.col("service.owner.full_name"), "ownerName"],
        [Sequelize.fn("COUNT", Sequelize.col("appointment.id")), "appointmentCount"],
      ],
      include: [
        {
          model: Service,
          required: true,
          attributes: [],
          include: [
            {
              model: Owner,
              attributes: [],
              required: true,
            },
            {
              model: ServiceCat,
              where: { name: serviceName },
              attributes: [],
              required: true,
            },
          ],
        },
      ],
      group: ["service.owner.id", "service.owner.full_name"],
      order: [[Sequelize.literal(`COUNT("appointment"."id")`), "DESC"]],
      raw: true,
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching top owners:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    sendErrorResponse(error, res, 400);
  }
};



module.exports = {
  getServicesUsedInDateRange,
  getClientsUsedServicesInDateRange,
  getClientsCanceledInDateRange,
  getTopOwnersByService,
  getPaymentsByClient,
};
