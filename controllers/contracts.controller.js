const Contract = require("../models/contract.model");
const Client = require("../models/client.model");
const Service = require("../models/services.model");
const Admin = require("../models/admin.model");
const Owner = require("../models/owner.model");
const Status = require("../models/status.model");
const { contractSchema } = require("../validations/contract.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");

const createContract = async (req, res) => {
  try {
    const { error, value } = contractSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const client = await Client.findByPk(value.clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const service = await Service.findByPk(value.serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const admin = await Admin.findByPk(value.adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const owner = await Owner.findByPk(value.ownerId);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const status = await Status.findByPk(value.statusId);
    if (!status) return res.status(404).json({ message: "Status not found" });

    const newContract = await Contract.create(value);
    res.status(201).json({ message: "Contract created", newContract });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllContracts = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const contracts = await Contract.findAll({
      limit,
      offset: (offset - 1) * limit,
      include: [Client, Service, Admin, Owner, Status],
    });

    res.status(200).json({ contracts });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findByPk(id, {
      include: [Client, Service, Admin, Owner, Status],
    });

    if (!contract) return res.status(404).json({ message: "Contract not found" });

    res.status(200).json({ contract });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Contract.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Contract not found" });

    const updatedContract = await Contract.findByPk(id);
    res.status(200).json({ message: "Contract updated", updatedContract });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contract.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Contract not found" });

    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
};
