const OrderService = require( './order.service' );
const {
  CustomError,
  ValidationError,
  NotFoundError,
  BadRequestError,
} = require( '../../errors/customErrors' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const paypalService = require( './paypal.service' );
const { PAYMENT_STATUS } = require( '../../utilities/constants' );

/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createOrder = async ( req, res ) => {
  const userId = req.user._id;
  const { addressId, items, totalAmount } = req.body;

  // Validate required fields
  if ( !addressId || !items?.length || !totalAmount ) {
    throw new ValidationError( "Missing required fields: userId, addressId, items, or totalAmount" );
  }

  // Validate items array
  if ( !Array.isArray( items ) || items.length === 0 ) {
    throw new ValidationError( "Items must be a non-empty array" );
  }

  // Validate totalAmount (must be a positive number)
  if ( typeof totalAmount !== "number" || totalAmount <= 0 ) {
    throw new ValidationError( "Total amount must be a positive number" );
  }

  // Create the order
  const newOrder = await OrderService.createOrder( {
    userId,
    addressId,
    items,
    totalAmount,
  } );

  // Create PayPal order
  const paypalOrder = await paypalService.createOrder( {
    orderId: newOrder._id.toString(),
    items,
    totalAmount
  } );

  newOrder.paymentId = paypalOrder.id;
  newOrder.paymentStatus = PAYMENT_STATUS.SAVED;
  await newOrder.save();

  // Send success response
  sendSuccessResponse( res, {
    statusCode: 201,
    message: "Order created successfully",
    data: newOrder,
  } );
};

/**
 * Capture PayPal payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.capturePayment = async ( req, res ) => {
  const { orderID } = req.body;
  if ( !orderID ) {
    throw new ValidationError( "Order Id required" );
  }

  // Find the order
  const existingOrder = await OrderService.findOrderByCriteria( { paymentId: orderID } );
  if ( !existingOrder ) {
    throw new NotFoundError( "Order not found" );
  }

  // Update payment status to "Approved"
  existingOrder.paymentStatus = PAYMENT_STATUS.APPROVED;
  await existingOrder.save();

  // Capture PayPal payment
  const captureData = await paypalService.capturePayment( orderID );

  // Update payment status based on capture response
  existingOrder.paymentStatus = PAYMENT_STATUS[ captureData.status ];
  await existingOrder.save();


  // Send success response
  sendSuccessResponse( res, {
    statusCode: 200,
    message: `Payment ${ captureData.status }`,
    data: existingOrder,
  } );

}



/**
 * Get an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrderById = async ( req, res ) => {
  const orderId = req.params.id;

  // Validate order ID
  if ( !orderId ) {
    throw new BadRequestError( 'Order ID is required' );
  }

  const order = await OrderService.getOrderById( orderId );

  // Check if order exists
  if ( !order ) {
    throw new NotFoundError( 'Order not found' );
  }

  // Send success response
  sendSuccessResponse( res, {
    message: 'Order retrieved successfully',
    data: order,
  } );
};

/**
 * Get all orders for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrdersByUser = async ( req, res ) => {
  const userId = req.user.id;

  // Validate user ID
  if ( !userId ) {
    throw new BadRequestError( 'User ID is required' );
  }

  const orders = await OrderService.getOrdersByUser( userId );

  // Send success response
  sendSuccessResponse( res, {
    message: 'Orders retrieved successfully',
    data: orders,
  } );
};

/**
 * Update the status of an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateOrderStatus = async ( req, res ) => {
  const orderId = req.params.id;
  const { status } = req.body;

  // Validate order ID
  if ( !orderId ) {
    throw new BadRequestError( 'Order ID is required' );
  }

  // Validate status
  const validStatuses = [ 'processing', 'shipped', 'delivered', 'cancelled' ];
  if ( !status || !validStatuses.includes( status ) ) {
    throw new ValidationError( `Status must be one of: ${ validStatuses.join( ', ' ) }` );
  }

  const updatedOrder = await OrderService.updateOrderStatus( orderId, status );

  // Check if order exists 
  if ( !updatedOrder ) {
    throw new NotFoundError( 'Order not found' );
  }

  // Send success response
  sendSuccessResponse( res, {
    message: 'Order status updated successfully',
    data: updatedOrder,
  } );
};