const express = require('express');
const asyncHandler = require('express-async-handler');
const verifyToken = require('../../middlewares/verify.Token.Middleware');
const {
    createInquiry,
    getInquiries,
    getInquiry,
    updateInquiry,
    deleteInquiry
} = require('./inquiry.controller');
const verifyAdmin = require('../../middlewares/verify.Admin.Middleware');
const router = express.Router();

router.post('/submit', asyncHandler(createInquiry));

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/get', asyncHandler(getInquiries));
router.get('/get/:id', asyncHandler(getInquiry));
router.put('/update/:id', asyncHandler(updateInquiry));
router.delete('/delete/:id', asyncHandler(deleteInquiry));

module.exports = router;