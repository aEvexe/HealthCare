const express = require("express");
const router = express.Router();
const { login, logout, refresh } = require("../controllers/auth-owner.controller");

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

module.exports = router;