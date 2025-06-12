const bcrypt = require("bcrypt");
const config = require("config");
const Owner = require("../models/owner.model");
const { ownerSchema } = require("../validations/owner.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");
const uuid = require("uuid");
const { mailService } = require("../services/mail.service");


const createOwner = async (req, res) => {
  try {
    // Validate input
    const { error, value } = ownerSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if owner already exists
    const existingOwner = await Owner.findOne({ where: { email: value.email } });
    if (existingOwner) {
      return res.status(409).send({ message: "Owner with this email already exists" });
    }

    // Hash password
    const hashed_password = await bcrypt.hash(value.password, 10);

    // Generate activation link
    const activation_link = uuid.v4();

    // Create new owner
    const newOwner = await Owner.create({
      full_name: value.full_name,
      email: value.email,
      phone: value.phone,
      hashed_password,
      is_active: false,
      activation_link,
      created_at: new Date(),
    });

    // Build activation URL
    const activationUrl = `${config.get("api_url")}/api/owner/activate/${activation_link}`;

    // Send activation email
    await mailService.sendMail(value.email, activationUrl);

    res.status(201).send({
      message: "Owner created successfully. Please check your email to activate your account.",
      owner: {
        id: newOwner.id,
        full_name: newOwner.full_name,
        email: newOwner.email,
        phone: newOwner.phone,
        is_active: newOwner.is_active,
      },
    });

  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllOwners = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const owners = await Owner.findAll({
      limit,
      offset: (offset - 1) * limit,
    });

    res.status(200).send({ owners });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByPk(id);

    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }

    res.status(200).send({ owner });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const updatedOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Owner.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).send({ message: "Owner not found" });
    }

    const updatedOwner = await Owner.findByPk(id);
    res.status(200).send({ message: "Owner updated", updatedOwner });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Owner.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send({ message: "Owner not found" });
    }

    res.status(200).send({ message: "Owner deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

// const changePassword = async (req, res) => {
//   try {
//     const adminId = req.admin.id; // From the middleware
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: "Both passwords are required" });
//     }

//     const admin = await Admin.findById(adminId);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Current password is incorrect" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     admin.password = hashedPassword;
//     await admin.save();

//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     sendErrorResponse(error, res, 500);
//   }
// };
const ownerActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const owner = await Owner.findOne({ where: { activation_link: link } });

    if (!owner) {
      return res.status(400).send({ message: "Owner link noto'g'ri" });
    }
    if (owner.is_active) {
      return res.status(400).send({ message: "Owner avval faollashtirilgan" });
    }

    owner.is_active = true;
    await owner.save();

    res.send({ message: "Owner faollashtirildi", isActive: owner.is_active });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createOwner,
  getAllOwners,
  getOwnerById,
  updatedOwner,
  deleteOwner,
  ownerActivate,
};
