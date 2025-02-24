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

// Error Handling Middleware
const errorMiddleware = require( "./middlewares/errorMiddleware" );
app.use(errorMiddleware);

// Health Check Route
app.get( "/", ( req, res ) => res.send( " Store Server is running!" ) );

module.exports = app; 