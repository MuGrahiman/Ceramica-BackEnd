
// order.service.js
class OrderService {
    constructor ( orderModel ) {
        this.Order = orderModel;
    }

    async createOrder ( orderData ) {
        return await this.Order.create( orderData );
    }

    async findOrderByCriteria ( criteria ) {
        return await this.Order.findOne( criteria ).populate( "userId" ).populate( "items.productId" );
    }


    async getOrderById ( orderId ) {
        return await this.Order.findById( orderId ).populate( "userId" ).populate( "items.productId" );
    }

    async getOrdersByUser ( userId ) {
        return await this.Order.find( { userId } ).sort( { createdAt: -1 } );
    }

    async updateOrderStatus ( orderId, status ) {
        return await this.Order.findByIdAndUpdate( orderId, { status }, { new: true } );
    }

}

module.exports = new OrderService( require( "./order.model" ) );
