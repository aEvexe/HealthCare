const express = require("express");
const router = express.Router();
const {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
} = require("../controllers/contracts.controller");
const adminJwtGuard = require("../middlewares/guards/admin.jwt.guard");

router.post("/", createContract);
router.get("/", /*adminJwtGuard,*/  getAllContracts);
router.get("/:id", adminJwtGuard, getContractById);
router.put("/:id", adminJwtGuard, updateContract);
router.delete("/:id", deleteContract)

module.exports = router;
