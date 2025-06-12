const express = require("express");
const router = express.Router();
const {
  createServiceCat,
  getAllServiceCat,
  getServiceCatById,
  updateServiceCat,
  deleteServiceCat,
} = require("../controllers/serviceCategpry.controller");

router.post("/", /*adminJwtGuard,*/ createServiceCat);
router.get("/", /*adminJwtGuard,*/ getAllServiceCat);
router.get("/:id", /*adminJwtGuard,*/ getServiceCatById);
router.put("/:id", /*adminJwtGuard,*/ updateServiceCat);
router.delete("/:id", /*adminJwtGuard,*/ deleteServiceCat);

module.exports = router;
