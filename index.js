const express = require( "express" );
const cors = require( "cors" );
const morgan = require( "morgan" );
const env = require( "./src/configs/env.config" );
const connectDB = require( "./src/configs/db.config" );

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
  credentials: true,
};

// Middleware Setup
app.use( cors( corsOptions ) );
app.use( morgan( "dev" ) );
app.use( express.json() );

// Route Imports
const bookRoutes = require( "./src/books/book.route" );
const orderRoutes = require( "./src/orders/order.route" );
const otpRoutes = require( "./src/otp/otp.route" );
const userRoutes = require( "./src/users/user.route" );
const adminRoutes = require( "./src/admin/admin.route" );
const inventoryRoutes = require( "./src/inventory/inventory.route" );
const errorMiddleware = require( "./src/middlewares/errorMiddleware" );

// Route Definitions
app.use( "/api/books", bookRoutes );
app.use( "/api/orders", orderRoutes );
app.use( "/api/otp", otpRoutes );
app.use( "/api/auth", userRoutes );
app.use( "/api/admin", adminRoutes );
app.use( "/api/inventory", inventoryRoutes );

// Catch-all route for unmatched requests
app.use( ( req, res, next ) => {
  const error = new Error( "Not Found" );
  error.status = 404;
  next( error );
} );

// Error Handling Middleware
app.use( errorMiddleware );

// Health Check Route
app.get( "/", ( req, res ) => res.send( "Book Store Server is running!" ) );

// Database Connection
connectDB()
  .then( () => console.log( "Database connected successfully!" ) )
  .catch( ( err ) => console.error( err ) );

// Start the Server
app.listen( env.Port, () => {
  console.log( `Server listening on port ${ env.Port }` );
} );
