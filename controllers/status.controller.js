const Status = require("../models/status.model");
const { statusSchema } = require("../validations/status.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");

const createStatus = async (req, res) => {
  try {
    const { error, value } = statusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newStatus = await Status.create(value);
    res.status(201).json({ message: "Status created", newStatus });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllStatuses = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const statuses = await Status.findAll({
      limit,
      offset: (offset - 1) * limit,
    });

    res.status(200).send({ statuses });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Status.findByPk(id);

    if (!status) {
      return res.status(404).send({ message: "Status not found" });
    }

    res.status(200).send({ status });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = statusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const [updated] = await Status.update(value, { where: { id } });

    if (!updated) {
      return res.status(404).send({ message: "Status not found" });
    }

    const updatedStatus = await Status.findByPk(id);
    res.status(200).send({ message: "Status updated", updatedStatus });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Status.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send({ message: "Status not found" });
    }

    res.status(200).send({ message: "Status deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
};
