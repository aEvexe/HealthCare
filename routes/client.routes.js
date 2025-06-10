const express = require("express");
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  clientActivate
} = require("../controllers/client.controller");
const clientJwtGuard = require("../middlewares/guards/client.jwt.guard");
const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const clientSelfJwtGuard = require("../middlewares/guards/client-self.jwt.guard");

const router = express.Router();

router.post("/", createClient);
router.get("/", adminJwtGuard, getAllClients);
router.get("/activate/:link", clientActivate);
router.get("/:id", clientJwtGuard, clientSelfJwtGuard, getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
