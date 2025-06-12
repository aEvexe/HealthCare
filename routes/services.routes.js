const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/services.controller");

router.post("/", /*adminJwtGuard,*/ createService);
router.get("/", /*adminJwtGuard,*/ getAllServices);
router.get("/:id", /*adminJwtGuard,*/ getServiceById);
router.put("/:id", /*adminJwtGuard,*/ updateService);
router.delete("/:id", /*adminJwtGuard,*/ deleteService);

module.exports = router;
