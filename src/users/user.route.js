const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

router.post("/sign-up", userController.Register); // Handle POST request for signup
router.post("/sign-in", userController.Login);
router.post("/forgotten", userController.Forgotten);

module.exports = router;
