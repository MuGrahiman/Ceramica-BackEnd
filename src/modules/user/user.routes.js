const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const userController = require('./user.controller');

// Auth routes
router.post('/sign-up', asyncHandler(userController.register));
router.post('/sign-in', asyncHandler(userController.login));
router.post('/forgot-password', asyncHandler(userController.forgotPassword));
// User management routes
router.get('/get', asyncHandler(userController.getAllUsers));
router.get('/get/:id', asyncHandler(userController.getUser));
router.put('/edit/:id', asyncHandler(userController.updateUserAccountStatus));

module.exports = router;