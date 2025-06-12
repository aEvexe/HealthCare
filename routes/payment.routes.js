const express = require("express");
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/payments.controller");

router.post("/", createPayment);
router.get("/", /*adminJwtGuard,*/ getAllPayments);
router.get("/:id", /*adminJwtGuard,*/ getPaymentById);
router.put("/:id", /*adminJwtGuard,*/ updatePayment);
router.delete("/:id", /*adminJwtGuard,*/ deletePayment);

module.exports = router;
