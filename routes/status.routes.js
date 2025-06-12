const express = require("express");
const router = express.Router();
const {
  createStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
  deleteStatus,
} = require("../controllers/status.controller");
const adminJwtGuard = require("../middlewares/guards/admin.jwt.guard");

router.post("/", adminJwtGuard, createStatus);
router.get("/", adminJwtGuard, getAllStatuses);
router.get("/:id", adminJwtGuard, getStatusById);
router.put("/:id", adminJwtGuard, updateStatus);
router.delete("/:id", adminJwtGuard, deleteStatus);

module.exports = router;
