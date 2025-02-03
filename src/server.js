// server.js
const app = require( "./app" ); // Import the Express app
const connectDB = require( "./configs/db.config" );
const env = require( "./configs/env.config" );

const PORT = env.Port || 3000;

// Connect to the database
connectDB()
  .then( () => {
    console.log( "Database connected successfully!" );

    // Start the server
    app.listen( PORT, () => {
      console.log( `Server listening on port ${ PORT }` );
    } );
  } )
  .catch( ( err ) => {
    console.error( "Database connection failed:", err );
    process.exit( 1 ); // Exit the process if the database connection fails
  } );