// middleware/adminOrSuperadmin.js
const { sendErrorResponse } = require("../../helpers/send_error_res");
const { AdminJwtServicee } = require("../../services/jwt.service");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).send({ message: "Authorization header not found" });
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Bearer token not found" });
    }

    const decodedPayload = await AdminJwtServicee.verifyAccessToken(token);

    if (!decodedPayload || !["admin", "superadmin"].includes(decodedPayload.role)) {
      return res.status(403).send({ message: "Access denied" });
    }

    req.admin = decodedPayload;
    return next();
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};
