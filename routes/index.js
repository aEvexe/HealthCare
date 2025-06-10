const router = require('express').Router()
const adminRouter = require("./admin.routes")
const clientRouter = require("./client.routes")
const ownerRouter = require("./owner.routes")
const statusRouter = require("./status.routes")
const serviceCatRouter = require("./serviceCategory.routes")
const serviceRouter = require("./services.routes")
const reviewRouter = require("./review.routes")
const appointmentsRouter = require("./appointment.routes")
const contractsRouter = require("./contracts.routes")
const paymentRouter = require("./payment.routes")
const authAdminRouter = require("./auth-admin.routes")
const authClientRouter = require("./auth-client.routes")
const authOwnerRouter = require("./auth-owner.routes")
const analOwnerRouter = require("./analititcs.routes")

router.use("/admin", adminRouter);
router.use("/client", clientRouter);
router.use("/owner", ownerRouter);
router.use("/status", statusRouter);
router.use("/service-category", serviceCatRouter);
router.use("/service", serviceRouter);
router.use("/review", reviewRouter);
router.use("/appointment", appointmentsRouter);
router.use("/contract", contractsRouter);
router.use("/payment", paymentRouter);
router.use("/reg-admin", authAdminRouter);
router.use("/reg-client", authClientRouter);
router.use("/reg-owner", authOwnerRouter);
router.use("/analytics", analOwnerRouter);

module.exports = router