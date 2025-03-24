
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


    async findOrderById ( orderId ) {
        return await this.Order.findById( orderId )
            .populate( "userId" ).populate( "items.productId" )
            .populate( "paymentId" ).populate( "addressId" )
            .populate( "couponId" );
    }

    async findOrdersByUser ( { userId = null, sortOption, search } = {} ) {
        const options = userId ? { userId } : {}
        return await this.Order.find( options ).sort( { createdAt: -1 } )
            .populate( "userId" ).populate( "paymentId" ).populate( "items.productId" );
    }

    async updateOrderStatus ( orderId, status ) {
        return await this.Order.findByIdAndUpdate( orderId, { status }, { new: true } );
    }

}

module.exports = new OrderService( require( "./order.model" ) );
