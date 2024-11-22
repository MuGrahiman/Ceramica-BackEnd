const express = require("express");
const admin = require("./admin.controller");
const adminsts = require("./admin.stats");

const router = express.Router();
router.get("/", adminsts.getData);
router.post("/admin", admin.login);
// router.post("/register",admin.register)
module.exports = router;
