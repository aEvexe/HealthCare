const { sendErrorResponse } = require("../helpers/send_error_res");
const Owner = require("../models/owner.model");
const config = require("config");
const bcrypt = require("bcrypt");
const { OwnerJwtServicee } = require("../services/jwt.service");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({
      where: { email },
    });

    if (!owner) {
      return sendErrorResponse(
        { message: "password or email incorrect" },
        res,
        400
      );
    }

    const verifyPassword = await bcrypt.compare(
      password,
      owner.hashed_password
    );
    if (!verifyPassword) {
      return sendErrorResponse(
        { message: "password or email incorrect" },
        res,
        400
      );
    }

    const payload = {
      id: owner.id,
      email: owner.email,
    };

    const tokens = OwnerJwtServicee.generateToken(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);
    owner.hashed_token = hashed_token;
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("owner_cookie_refresh_time"),
      httpOnly: true,
    });
    res
      .status(200)
      .send({ message: "Owner logged in", accessToken: tokens.accessToken });
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

    const decodedToken = await  OwnerJwtServicee.verifyRefreshToken(
      refreshToken
    );

    const owner = await Owner.update(
      { hashed_token: null },
      { where: { id: decodedToken.id }, returning: true }
    );

    if (!owner) {
      return res.status(400).send({ message: "Token not correct" });
    }

    res.clearCookie("refreshToken");
    res.send({ owner: owner });
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

    const decodedToken = await OwnerJwtServicee.verifyRefreshToken(
      refreshToken
    );

    const client = await Owner.findByPk(decodedToken.id);

    if (!client) {
      return res.status(400).send({ message: "Such token owner not found" });
    }

    const payload = {
      id: client.id,
      email: client.email,
    };

    const tokens = OwnerJwtServicee.generateToken(payload);

    const hashed_token = await bcrypt.hash(tokens.accessToken, 7);
    client.hashed_token = hashed_token;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("owner_cookie_refresh_time"),
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
