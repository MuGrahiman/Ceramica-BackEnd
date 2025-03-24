
// payment.service.js
class PaymentService {
    constructor ( paymentModel ) {
        this.Payment = paymentModel;
    }

    async createPayment ( orderData ) {
        return await this.Payment.create( orderData );
    }

    async findPaymentByCriteria ( criteria ) {
        return await this.Payment.findOne( criteria );
    }


    async getPaymentById ( paymentId ) {
        return await this.Payment.findById( paymentId );
    }


    
    async getOrdersByUser ( userId ) {
        return await this.Payment.find( { userId } ).sort( { createdAt: -1 } );
    }

    async updateOrderStatus ( orderId, status ) {
        return await this.Payment.findByIdAndUpdate( orderId, { status }, { new: true } );
    }

}

module.exports = new PaymentService( require( "./payment.model" ) );
