const express = require("express");

// Import all routes
const bookRoutes = require("../modules/books/book.route");
const cartRoutes = require("../modules/cart/cart.route");
const orderRoutes = require("../modules/orders/order.route");
const otpRoutes = require("../modules/otp/otp.route");
const userRoutes = require("../modules/users/user.route");
const adminRoutes = require("../modules/admin/admin.route");
const inventoryRoutes = require("../modules/inventory/inventory.route");
const wishListRoutes = require("../modules/wishList/wishList.route");
const { NotFoundError } = require( "../errors/customErrors" );

const router = express.Router();

// Define API routes
router.use("/books", bookRoutes);
router.use("/orders", orderRoutes);
router.use("/otp", otpRoutes);
router.use("/auth", userRoutes);
router.use("/admin", adminRoutes);
router.use("/inventory", inventoryRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishListRoutes);

// Catch-all route for unmatched requests
router.use((req, res, next) => {
    const error = new NotFoundError("Not found the url");
    next(error);
});

 
module.exports = router;
