const express = require( 'express' );
const asyncHandler = require( "express-async-handler" );
const { createPaymentIntentHandler, savePaymentHandler } = require( './stripe.controller' );

const router = express.Router();

// Create a PaymentIntent
router.post( '/create-payment-intent', asyncHandler( createPaymentIntentHandler ) );

// Save payment details
router.post( '/save-payment', asyncHandler( savePaymentHandler ) );

module.exports = router;