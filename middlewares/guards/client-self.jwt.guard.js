// middlewares/guards/client-self.jwt.guard.js
const { sendErrorResponse } = require("../../helpers/send_error_res");

module.exports = (req, res, next) => {
  try {
    // ✅ If admin is set, allow
    if (req.admin.role && req.admin.role == "admin") {
      return next();
    }

    // ✅ If client matches the :id param, allow
    if (req.client && req.params.id == req.client.id) {
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You can only access your own account.",
    });
  } catch (error) {
    sendErrorResponse(error, res, 400);
  }
};
