const Payment = require("../models/payment.model");
const Contract = require("../models/contract.model");
const Status = require("../models/status.model");
const { paymentSchema } = require("../validations/payment.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");

const createPayment = async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const contract = await Contract.findByPk(value.contractId);
    if (!contract) return res.status(404).json({ message: "Contract not found" });

    const status = await Status.findByPk(value.statusId);
    if (!status) return res.status(404).json({ message: "Status not found" });

    const newPayment = await Payment.create(value);
    res.status(201).json({ message: "Payment created", newPayment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllPayments = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const payments = await Payment.findAll({
      limit,
      offset: (offset - 1) * limit,
      include: [Contract, Status],
    });

    res.status(200).json({ payments });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [Contract, Status],
    });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ payment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Payment.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: "Payment not found" });

    const updatedPayment = await Payment.findByPk(id);
    res.status(200).json({ message: "Payment updated", updatedPayment });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
