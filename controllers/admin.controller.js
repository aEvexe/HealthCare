const { sendErrorResponse } = require("../helpers/send_error_res");
const bcrypt = require("bcrypt");
const config = require("config");
const crypto = require("crypto");
const Admin = require("../models/admin.model");
const { adminSchema } = require("../validations/admin.validation");
const uuid = require("uuid");
const {mailService} = require("../services/mail.service");

const create = async (req, res) => {
  try {
    const { error, value } = adminSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const existingAdmin = await Admin.findOne({ where: { email: value.email } });
    if (existingAdmin) {
      return res.status(409).send({ message: "Admin with this email already exists" });
    }

    const hashed_password = await bcrypt.hash(value.password, 10);
    const activation_link = uuid.v4();
    const newAdmin = await Admin.create({
      name: value.name,
      email: value.email,
      hashed_password,
      created_at: new Date().toISOString(),
      is_active: false,
      activation_link,
    });
    const link = `${config.get(
      "api_url"
    )}/api/admin/activate/${activation_link}`;
    await mailService.sendMail(value.email, link);


    res.status(201).send({ message: "Admin created successfully", newAdmin });
  } catch (error) {
    return sendErrorResponse(error, res, 400);
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
    const { id } = req.params;

    const [updated] = await Admin.update(req.body, { where: { id } });

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
    const deleted = await Admin.destroy({ where: { id }, restartIdentity: true});

    if (!deleted) {
      return res.status(404).send({ message: "Admin not found" });
    }

    res.status(200).send({ message: "Admin deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

// const changePassword = async (req, res) => {
//   try {
//     const adminId = req.admin.id; 
//     const { currentPassword, newPassword } = req.body;

//     // Validate input
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: "Both current and new passwords are required" });
//     }

//     // Find admin by ID
//     const admin = await Admin.findByPk(adminId);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // Compare current password with stored hashed password
//     const isMatch = await bcrypt.compare(currentPassword, admin.hashed_password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Current password is incorrect" });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
//     admin.hashed_password = hashedPassword;
//     await admin.save();

//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Change password error:", error);
//     sendErrorResponse(error, res, 500);
//   }
// };

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
  // changePassword
  adminActivate
};
