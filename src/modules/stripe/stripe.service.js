const Stripe = require( 'stripe' );
const Payment = require( './stripe.model' );
const { Stripe_Secret_Key } = require( '../../configs/env.config' );

const stripe = Stripe( Stripe_Secret_Key );

/**
 * Create a PaymentIntent
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code (e.g., 'usd')
 * @returns {Promise<string>} - Client secret for the PaymentIntent
 */
const createPaymentIntent = async ( totalAmount, currency = 'usd' ) => {
    return await stripe.paymentIntents.create( {
        amount: totalAmount * 100,
        currency,
    } );

};

/**
 * Save payment details to the database
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} - Saved payment document
 */
const savePayment = async ( paymentData ) => {
    const payment = new Payment( paymentData );
    await payment.save();
    return payment;

};

module.exports = { createPaymentIntent, savePayment };