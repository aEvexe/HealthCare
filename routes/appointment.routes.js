const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments.controller");
const adminJwtGuard = require("../middlewares/guards/admin.jwt.guard");

router.post("/", appointmentController.createAppointment);
router.get("/", /*adminJwtGuard,*/ appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
