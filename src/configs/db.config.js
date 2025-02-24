// MongoDB connection setup
const mongoose = require( "mongoose" );
const env = require( "./env.config" );
const asyncHandler = require( "express-async-handler" );

const DB_URL = `mongodb+srv://${ env.MongoDB_USER }:${ env.MongoDB_PASS }@${ env.MongoDB_CLUSTER }.mongodb.net/${ env.MongoDB_DB }?retryWrites=true&w=majority`; // Connection string
const connectDB = async () => {
    try {
        return await mongoose.connect( DB_URL );

    } catch ( error ) {
        console.error('Mongoose Error:', error )
    }
}

// Listen for Mongoose connection errors
mongoose.connection.on( "error", ( err ) => {
    console.error( "Mongoose connection error:", err );
    process.exit( 1 ); // Exit the process on connection error
} );

module.exports = connectDB;