const express = require("express");
const admin = require("./admin.controller");
// const adminsts = require("./admin.stats");

const router = express.Router();
router.post("/sign-in", admin.Login);
// router.get("/", adminsts.getData);
router.post("/sign-up",admin.AddAdmin)
module.exports = router;
 