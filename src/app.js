// app.js
const express = require( "express" );
const cors = require( "cors" );
const morgan = require( "morgan" );

// Initialize the Express app
const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://book-app-frontend-tau.vercel.app",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: [ 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE' ],
  allowedHeaders: [ 'Authorization', 'Content-Type' ],
  credentials: true,
};

// Middleware Setup
app.use( cors( corsOptions ) );
app.use( morgan( "dev" ) );
app.use( express.json() );

// Import Route 
const router = require( "./router/router" );
app.use( "/api", router );

// const bookRoutes = require("./src/books/book.route");
// const cartRoutes = require("./src/cart/cart.route");
// const orderRoutes = require("./src/orders/order.route");
// const otpRoutes = require("./src/otp/otp.route");
// const userRoutes = require("./src/users/user.route");
// const adminRoutes = require("./src/admin/admin.route");
// const inventoryRoutes = require("./src/inventory/inventory.route");
// const errorMiddleware = require("./src/middlewares/errorMiddleware");

// // Route Definitions
// app.use("/api/books", bookRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/otp", otpRoutes);
// app.use("/api/auth", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use('/api/cart', cartRoutes);
// // app.use('/api/wishlist', wishlistRoutes);

// // Catch-all route for unmatched requests
// app.use((req, res, next) => {
//   const error = new Error("Not Found");
//   error.status = 404;
//   next(error);
// });

// // Error Handling Middleware
// app.use(errorMiddleware);

// Health Check Route
app.get( "/", ( req, res ) => res.send( "Book Store Server is running!" ) );

module.exports = app; 