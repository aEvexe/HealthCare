const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const adminSelfJwtGuard = require("../middlewares/guards/admin-self.jwt.guard");
const SuperAdminJwtGuard = require("../middlewares/guards/SuperAdmin-jwt.guard");
const adminJwtGuard = require("../middlewares/guards/admin.jwt.guard");

router.post("/", SuperAdminJwtGuard, adminController.create);
router.get("/", adminJwtGuard, adminController.getAll);
router.get("/activate/:link", adminController.adminActivate);
router.get("/:id", adminJwtGuard, adminSelfJwtGuard, adminController.getOne);
router.put("/:id", adminController.update);
router.delete("/:id", adminController.remove);

module.exports = router;
