const express = require("express");
const router = express.Router();
const {
  createServiceCat,
  getAllServiceCat,
  getServiceCatById,
  updateServiceCat,
  deleteServiceCat,
} = require("../controllers/serviceCategpry.controller");

router.post("/", createServiceCat);
router.get("/", getAllServiceCat);
router.get("/:id", getServiceCatById);
router.put("/:id", updateServiceCat);
router.delete("/:id", deleteServiceCat);

module.exports = router;
