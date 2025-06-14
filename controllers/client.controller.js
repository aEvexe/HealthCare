const bcrypt = require("bcrypt");
const config = require('config');
const Client = require("../models/client.model");
const { clientSchema } = require("../validations/client.validation");
const { sendErrorResponse } = require("../helpers/send_error_res");
const uuid = require("uuid");
const {mailService} = require("../services/mail.service");

const createClient = async (req, res) => {
  try {
    // Validate input
    const { error, value } = clientSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ where: { email: value.email } });
    if (existingClient) {
      return res.status(409).send({ message: "Client with this email already exists" });
    }

    // Hash password
    const hashed_password = await bcrypt.hash(value.password, 10);

    // Generate activation link
    const activation_link = uuid.v4();

    // Create new client
    const newClient = await Client.create({
      full_name: value.full_name,
      email: value.email,
      phone: value.phone,
      passport: value.passport,
      birth_date: value.birth_date,
      address: value.address,
      hashed_password,
      is_active: false,
      activation_link,
      created_at: new Date(),
    });

    // Prepare and send activation email
    const activationUrl = `${config.get("api_url")}/api/client/activate/${activation_link}`;
    await mailService.sendMail(value.email, activationUrl);

    res.status(201).send({
      message: "Client created successfully. Please check your email to activate your account.",
      client: {
        id: newClient.id,
        full_name: newClient.full_name,
        email: newClient.email,
        phone: newClient.phone,
        is_active: newClient.is_active,
      },
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const getAllClients = async (req, res) => {
  try {
    let { limit = 10, offset = 1 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    const clients = await Client.findAll({
      limit,
      offset: (offset - 1) * limit,
    });

    res.status(200).send({ clients });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    res.status(200).send({ client });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Client.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).send({ message: "Client not found" });
    }

    const updatedClient = await Client.findByPk(id);
    res.status(200).send({ message: "Client updated", updatedClient });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Client.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send({ message: "Client not found" });
    }

    res.status(200).send({ message: "Client deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const clientActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const client = await Client.findOne({ where: { activation_link: link } }); 

    if (!client) {
      return res.status(400).send({ message: "Client link noto'g'ri" });
    }
    if (client.is_active) {
      return res.status(400).send({ message: "Client avval faollashtirilgan" });
    }

    client.is_active = true;
    await client.save();

    res.send({ message: "Client activated successfully", isActive: client.is_active });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  clientActivate
};
