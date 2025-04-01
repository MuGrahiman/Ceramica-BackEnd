const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler');
const userController = require("./user.controller");

router.post("/sign-up", asyncHandler(userController.register));
router.post("/sign-in", asyncHandler(userController.login));
router.post("/forgot", asyncHandler(userController.forgotPassword));

module.exports = router;