 const ServiceCat = require("../models/serviceCategory.model");
 const Status = require("../models/status.model");
const { serviceCatSchema } = require("../validations/serviceCategory.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");

const createServiceCat = async (req, res) => {
  try {
    const { error, value } = serviceCatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newServiceCat = await ServiceCat.create(value);
    res.status(201).json({ message: "Service created", newServiceCat });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllServiceCat = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const serviceCat = await ServiceCat.findAll({
      limit,
      offset: (offset - 1) * limit,
    });

    res.status(200).send({ serviceCat });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getServiceCatById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceCat = await ServiceCat.findByPk(id);

    if (!serviceCat) {
      return res.status(404).send({ message: "Status not found" });
    }

    res.status(200).send({ serviceCat });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateServiceCat = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = serviceCatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const [updated] = await ServiceCat.update(value, { where: { id } });

    if (!updated) {
      return res.status(404).send({ message: "ServiceCategory not found" });
    }

    const updatedServiceCat = await ServiceCat.findByPk(id);
    res.status(200).send({ message: "Service Category updated", updatedServiceCat });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteServiceCat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Status.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send({ message: "Service Category not found" });
    }

    res.status(200).send({ message: "Service Category deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createServiceCat,
  getAllServiceCat,
  getServiceCatById,
  updateServiceCat,
  deleteServiceCat,
};
