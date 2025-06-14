const { sendErrorResponse } = require("../helpers/send_error_res");
const bcrypt = require("bcrypt");
const config = require("config");
const Admin = require("../models/admin.model");
const { adminSchema } = require("../validations/admin.validation");
const uuid = require("uuid");
const { mailService } = require("../services/mail.service");

const create = async (req, res) => {
  try {
    const { error, value } = adminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, role } = value;

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Admin with this email already exists." });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email,
      hashed_password,
      role: role || "admin",
      is_activee: true,
    });

    res.status(201).json({ message: "Admin created", data: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const result = await Admin.findAll({
      limit,
      offset: (offset - 1) * limit,
    });

    res.status(200).send({ message: "Success", result });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({ admin });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = adminSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;

    if (value.password) {
      value.hashed_password = await bcrypt.hash(value.password, 10);
      delete value.password;
    }

    const [updated] = await Admin.update(value, { where: { id } });

    if (!updated) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const updatedAdmin = await Admin.findByPk(id);
    res.status(200).send({ message: "Admin updated", updatedAdmin });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admin.destroy({ where: { id }, restartIdentity: true });

    if (!deleted) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({ message: "Admin deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const adminActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const admin = await Admin.findOne({ where: { activation_link: link } });

    if (!admin) {
      return res.status(400).send({ message: "Admin link noto'g'ri" });
    }
    if (admin.is_activee) {
      return res.status(400).send({ message: "Admin avval faollashtirilgan" });
    }

    admin.is_activee = true;
    await admin.save();

    res.send({ message: "Admin faollashtirildi", isActive: admin.is_activee });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  adminActivate,
};
