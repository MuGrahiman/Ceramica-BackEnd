const paypal = require( "@paypal/paypal-server-sdk" );
const client = require( "../../configs/paypal.config" );
const ordersController = new paypal.OrdersController( client );

class PayPalService {
    /**
     * Create a PayPal order
     * @param {Object} options - Options for creating the order
     * @param {string} options.orderId - MongoDB order ID
     * @param {Array} options.items - List of items in the order
     * @param {number} options.totalAmount - Total amount of the order
     * @param {string} options.currency - Currency code (default: 'USD')
     * @returns {Object} - PayPal order details
     */
    async createOrder ( { orderId, items, totalAmount, currency = "USD" } ) {
        const { result } = await ordersController.ordersCreate( {
            body: {
                intent: paypal.CheckoutPaymentIntent.Capture,
                purchaseUnits: [
                    {
                        customId: orderId,
                        amount: {
                            currencyCode: currency,
                            value: totalAmount.toString(),
                            breakdown: {
                                itemTotal: {
                                    currencyCode: currency,
                                    value: totalAmount.toString(),
                                },
                            },
                        },
                        items: items.map( ( item ) => ( {
                            name: item.title,
                            unitAmount: {
                                currencyCode: currency,
                                value: item.price.toString(),
                            },
                            quantity: item.quantity.toString(),
                        } ) ),
                    },
                ],
            },
            prefer: "return=minimal",
        } );
        return result;

    }

    /**
     * Capture PayPal payment
     * @param {string} orderId - PayPal order ID
     * @returns {Object} - Capture response
     */
    async capturePayment ( orderId ) {
        const { result,...httpResponse } = await ordersController.ordersCapture( {
            id: orderId,
            prefer: "return=minimal",
        } );
        return result;

    }
}

module.exports = new PayPalService();