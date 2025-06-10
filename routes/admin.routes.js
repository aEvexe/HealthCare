const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const isAdminAuth = require("../middlewares/guards/admin-jwt.guard");
const adminSelfJwtGuard = require("../middlewares/guards/admin-self.jwt.guard");

router.post("/", adminController.create);
router.get("/", isAdminAuth, adminController.getAll);
router.get("/activate/:link", adminController.adminActivate);
router.get("/:id", isAdminAuth, adminSelfJwtGuard, adminController.getOne);
router.put("/:id", adminController.update);
router.delete("/:id", adminController.remove);

module.exports = router;
