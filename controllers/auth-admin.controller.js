const { sendErrorResponse } = require("../helpers/send_error_res");
const Admin = require("../models/admin.model");
const config = require("config");
const bcrypt = require("bcrypt");
const { AdminJwtServicee } = require("../services/jwt.service");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
      where: { email },
    });

    if (!admin) {
      return sendErrorResponse(
        { message: "password or email incorrect" },
        res,
        400
      );
    }

    const verifyPassword = await bcrypt.compare(
      password,
      admin.hashed_password
    );
    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "password or email incorrect" },
        res,
        400
      );
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      role: "admin",
    };

    const tokens = AdminJwtServicee.generateToken(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);
    admin.hashed_token = hashed_token;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("admin_cookie_refresh_time"),
      httpOnly: true,
    });
    res
      .status(200)
      .send({ message: "Admin logged in", accessToken: tokens.accessToken });
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

    const decodedToken = await AdminJwtServicee.verifyRefreshToken(
      refreshToken
    );

    const admin = await Admin.update(
      { hashed_token: null },
      { where: { id: decodedToken.id }, returning: true }
    );

    if (!admin) {
      return res.status(400).send({ message: "Token not correct" });
    }

    res.clearCookie("refreshToken");
    res.send({ admin: admin });
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

    const decodedToken = await AdminJwtServicee.verifyRefreshToken(
      refreshToken
    );

    const admin = await Admin.findByPk(decodedToken.id);

    if (!admin) {
      return res.status(400).send({ message: "Such token admin not found" });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
    };

    const tokens = AdminJwtServicee.generateToken(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);
    admin.hashed_token = hashed_token;
    await admin.save();

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
