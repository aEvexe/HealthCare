const Service = require("../models/services.model");
const Owner = require("../models/owner.model");
const ServiceCat = require("../models/serviceCategory.model");
const { sendErrorResponse } = require("../helpers/send_error_res");
const { serviceSchema } = require("../validations/services.validation");

const createService = async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newService = await Service.create(value);
    res.status(201).json({ message: "Service created", newService });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllServices = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const services = await Service.findAll({
      include: [Owner, ServiceCat],
      limit,
      offset: (offset - 1) * limit,
    });

    res.status(200).json({ services });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: [Owner, ServiceCat],
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ service });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const [updated] = await Service.update(value, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updatedService = await Service.findByPk(id, {
      include: [Owner, ServiceCat],
    });

    res.status(200).json({ message: "Service updated", updatedService });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Service.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
