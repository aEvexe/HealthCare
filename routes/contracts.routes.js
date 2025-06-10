const express = require("express");
const router = express.Router();
const {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
} = require("../controllers/contracts.controller");

router.post("/", createContract);
router.get("/", getAllContracts);
router.get("/:id", getContractById);
router.put("/:id", updateContract);
router.delete("/:id", deleteContract)

module.exports = router;
