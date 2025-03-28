const express = require('express');
const asyncHandler = require('express-async-handler');
const verifyToken = require('../../middlewares/verify.Token.Middleware');
const {
    createInquiry,
    getInquiries,
    getInquiry,
    replyToInquiry,
    deleteInquiry
} = require('./inquiry.controller');
const verifyAdmin = require('../../middlewares/verify.Admin.Middleware');
const router = express.Router();

router.post('/submit', asyncHandler(createInquiry));

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/get', asyncHandler(getInquiries));
router.get('/get/:id', asyncHandler(getInquiry));
router.post('/reply/:id', asyncHandler(replyToInquiry));
router.delete('/delete/:id', asyncHandler(deleteInquiry));

module.exports = router;