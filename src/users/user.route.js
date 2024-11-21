const express =  require('express');
const router =  express.Router();

const userController = require('./user.controller')

router.post("/sign-in",userController.Login)

module.exports = router;