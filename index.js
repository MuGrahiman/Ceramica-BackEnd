// index.js
require("dotenv").config(); // Load environment variables from .env file

// Log the environment
console.log(`Running in ${process.env.NODE_ENV || "development"} mode`);

// Start the server
require("./src/server");