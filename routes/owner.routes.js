const express = require("express");
const {
  createOwner,
  getAllOwners,
  getOwnerById,
  updatedOwner,
  deleteOwner,
  ownerActivate,
} = require("../controllers/owner.controller");
const ownerJwtGuard = require("../middlewares/guards/owner.jwt.guard");
const ownerSelfJwtGuard = require("../middlewares/guards/owner-self.jwt.guard");
const adminJwtGuard = require("../middlewares/guards/SuperAdmin-jwt.guard");


const router = express.Router();

router.post("/", createOwner);
router.get("/", adminJwtGuard, getAllOwners); 
router.get("/activate/:link", ownerActivate);
router.get("/:id", ownerJwtGuard, ownerSelfJwtGuard, getOwnerById);
router.put("/:id", updatedOwner);
router.delete("/:id", deleteOwner);

module.exports = router;
