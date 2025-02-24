const { createPaymentIntent, savePayment } = require( './stripe.service' );
const { NotFoundError } = require( '../../errors/customErrors' );

/**
 * Create a PaymentIntent and return the client secret
 */
const createPaymentIntentHandler = async ( req, res ) => {
    const { amount, currency } = req.body;
    console.log( "🚀 ~ createPaymentIntentHandler ~ amount:", amount )

    const paymentIntent = await createPaymentIntent( amount.amount, currency );
    console.log( "🚀 ~ createPaymentIntentHandler ~ paymentIntent:", paymentIntent )
    if ( !paymentIntent ) {
        throw new NotFoundError( 'payment indentation is not found ' )
    }
    res.status( 200 ).json( { data: { clientSecret: paymentIntent.client_secret } } );

};

/**
 * Save payment details to the database
 */
const savePaymentHandler = async ( req, res ) => {
    const { paymentId, amount, currency, status } = req.body;

    const payment = await savePayment( { paymentId, amount, currency, status } );
    res.status( 201 ).json( payment );

};

module.exports = { createPaymentIntentHandler, savePaymentHandler };