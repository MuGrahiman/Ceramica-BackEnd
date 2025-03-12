const express = require('express');
const asyncHandler = require('express-async-handler');
const verifyToken = require('../../middlewares/verify.Token.Middleware');
const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon
} = require('./coupon.controller');
const router = express.Router();

router.post('/create',  asyncHandler(createCoupon));
router.get('/get',  asyncHandler(getCoupons));
router.get('/get/:id',  asyncHandler(getCoupon));
router.route('/update/:id')
    .put( asyncHandler(updateCoupon))
    .patch( asyncHandler(updateCouponStatus));
router.delete('/delete/:id',  asyncHandler(deleteCoupon));

module.exports = router;