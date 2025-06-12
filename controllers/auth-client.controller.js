const { sendErrorResponse } = require("../helpers/send_error_res");
const Client = require("../models/client.model");
const config = require("config");
const bcrypt = require("bcrypt");
const { ClientJwtServicee } = require("../services/jwt.service");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({
      where: { email },
    });

    if (!client) {
      return sendErrorResponse(
        { message: "password or email incorrect" },
        res,
        400
      );
    }

    const verifyPassword = await bcrypt.compare(
      password,
      client.hashed_password
    );
    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "password or email incorrect" },
        res,
        400
      );
    }

    const payload = {
      id: client.id,
      email: client.email,
      role: "client"
    };

    const tokens = ClientJwtServicee.generateToken(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);
    client.hashed_token = hashed_token;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("client_cookie_refresh_time"),
      httpOnly: true,
    });
    res
      .status(200)
      .send({ message: "Client logged in", accessToken: tokens.accessToken });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Cookie not found in refresh token" },
        res,
        400
      );
    }

    const decodedToken = await ClientJwtServicee.verifyRefreshToken(
      refreshToken
    );

    const client = await Client.update(
      { hashed_token: null },
      { where: { id: decodedToken.id }, returning: true }
    );

    if (!client) {
      return res.status(400).send({ message: "Token not correct" });
    }

    res.clearCookie("refreshToken");
    res.send({ client: client });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return sendErrorResponse(
        { message: "Cookie not found in refresh token" },
        res,
        400
      );
    }

    const decodedToken = await ClientJwtServicee.verifyRefreshToken(
      refreshToken
    );

    const client = await Client.findByPk(decodedToken.id);

    if (!client) {
      return res.status(400).send({ message: "Such token client not found" });
    }

    const payload = {
      id: client.id,
      email: client.email,
    };

    const tokens = ClientJwtServicee.generateToken(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);
    client.hashed_token = hashed_token;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("admin_cookie_refresh_time"),
      httpOnly: true,
    });
    res
      .status(200)
      .send({ message: "New refresh token", accessToken: tokens.accessToken });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};

module.exports = {
  login,
  logout,
  refresh,
};
