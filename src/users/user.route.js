const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

router.post("/sign-up", userController.Register); 
router.post("/sign-in", userController.Login);
router.post("/forgot", userController.Forgotten);

module.exports = router;
