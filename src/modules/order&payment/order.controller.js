const CouponService = require( '../coupon/coupon.service' );
const OrderService = require( './order.service' );
const {
  ValidationError,
  NotFoundError,
  BadRequestError,
} = require( '../../errors/customErrors' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const paypalService = require( './paypal.service' );
const { PAYMENT_STATUS, ORDER_STATUSES, ORDER_STATUSES_ARRAY } = require( '../../utilities/constants' );
const paymentService = require( './payment.service' );
const { applyDiscountToItems } = require( '../../utilities/discountUtility' );
const { getSortOptions } = require( '../../utilities/sort' );
const { USER_ROLES } = require( "../../utilities/constants" );

/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createOrder = async ( req, res ) => {
  const userId = req.user._id;
  const { addressId, items, totalAmount, couponId } = req.body;

  // Validate required fields
  if ( !addressId || !items?.length ) {
    throw new ValidationError( "Missing required fields" );
  }

  // Validate items array
  if ( !Array.isArray( items ) || items.length === 0 ) {
    throw new ValidationError( "Items must be a non-empty array" );
  }

  // Validate totalAmount (must be a positive number)
  if ( typeof totalAmount !== "number" || totalAmount <= 0 ) {
    throw new ValidationError( "Total amount must be a positive number" );
  }
  let orderedItems = items, orderedAmount = totalAmount;
  if ( couponId ) {
    const coupon = await CouponService.findCoupon( { _id: couponId } );

    // Validate totalAmount (must be a positive number)
    if ( !coupon || !Object.keys( coupon ).length ) {
      throw new NotFoundError( "Coupon not found" );
    }

    const discountPercentage = coupon.discount; 

    const { adjustedItems, adjustedTotal } = applyDiscountToItems( items, discountPercentage );

    orderedItems = adjustedItems
    orderedAmount = adjustedTotal

  }

  // Create the order
  const newOrder = await OrderService.createOrder( {
    userId,
    addressId,
    couponId,
    items: orderedItems,
    totalAmount: orderedAmount,

  } );

  // Create PayPal order
  const paypalOrder = await paypalService.createOrder( {
    orderId: newOrder._id.toString(),
    items: orderedItems,
    totalAmount: orderedAmount
  } );

  // Create PayPal order
  const newPayment = await paymentService.createPayment( {
    orderId: newOrder._id,
    paypalId: paypalOrder.id,
  } );
  newOrder.paymentId = newPayment._id;
  await newOrder.save();
  newPayment.status = PAYMENT_STATUS.SAVED;
  await newPayment.save();

  // Send success response
  sendSuccessResponse( res, {
    statusCode: 201,
    message: "Order created successfully",
    data: paypalOrder.id,
  } );
};

/**
 * Capture PayPal payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.capturePayment = async ( req, res ) => {
  const userId = req.user._id;
  const { orderID } = req.body;
  if ( !orderID ) {
    throw new ValidationError( "Order Id required" );
  }

  // Find the payment
  const existingPayment = await paymentService.findPaymentByCriteria( { paypalId: orderID } );
  if ( !existingPayment ) {
    throw new NotFoundError( "Payment not found" );
  }

  // Find the order
  const existingOrder = await OrderService.findOrderByCriteria( { paymentId: existingPayment._id } );
  if ( !existingOrder ) {
    throw new NotFoundError( "Order not found" );
  }
  if ( !existingOrder._id.equals( existingPayment.orderId ) ) {
    throw new ValidationError( "Order not match" );
  }

  // Update payment status to "Approved"
  existingPayment.status = PAYMENT_STATUS.APPROVED;
  await existingPayment.save();

  // Capture PayPal payment
  const captureData = await paypalService.capturePayment( orderID );

  // Update payment status based on capture response
  const payer = captureData.payer
  existingPayment.payerId = payer.payerId;
  existingPayment.payerMail = payer.emailAddress;

  const capture = captureData.purchaseUnits[ 0 ].payments.captures[ 0 ]
  existingPayment.status = PAYMENT_STATUS[ capture.status ];
  existingPayment.amount = capture.amount;
  existingPayment.transactionId = capture.id;
  existingPayment.createTime = capture.createTime;
  await existingPayment.save();

  if ( existingOrder.couponId ) {
    // Find the coupon by ID
    const coupon = await CouponService.findCoupon( { _id: existingOrder.couponId } );
    if ( coupon.redeemedBy.includes( userId ) ) {
      throw new Error( 'User has already redeemed this coupon' );
    }

    // Add the user ID to the redeemedBy array
    coupon.redeemedBy.push( userId );

    // Save the updated coupon
    await coupon.save();
  }

  // Send success response
  sendSuccessResponse( res, {
    statusCode: 200,
    message: `Payment ${ existingPayment.status }`,
    data: existingPayment,
  } );

}

/**
 * Get an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrderPaymentDetails = async ( req, res ) => {
  const paymentId = req.params.id;

  // Validate order ID
  if ( !paymentId ) {
    throw new BadRequestError( 'Order ID is required' );
  }

  const payment = await paymentService.getPaymentById( paymentId );

  // Check if payment exists
  if ( !payment ) {
    throw new NotFoundError( 'Order not found' );
  }

  // Send success response
  sendSuccessResponse( res, {
    message: 'Payment retrieved successfully',
    data: payment,
  } );
};



/**
 * Get all orders for a admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrdersForAdmin = async ( req, res ) => {
  const userRole = req.user.roles;
  if ( userRole !== USER_ROLES.ADMIN ) {
    throw new ForbiddenError( 'User is not allowed to change the status' );
  }
  
  const orders = await OrderService.findOrdersByUser();

  // Send success response
  sendSuccessResponse( res, {
    message: 'Orders retrieved successfully',
    data: orders,
  } );
};

/**
 * Get all orders for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrdersForUser = async ( req, res ) => {
  const userId = req.user.id;

  // Validate user ID
  if ( !userId ) {
    throw new BadRequestError( 'User ID is required' );
  }

  const orders = await OrderService.findOrdersByUser( { userId } );

  // Send success response
  sendSuccessResponse( res, {
    message: 'Orders retrieved successfully',
    data: orders,
  } );
};

/**
 * Get all orders for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrderById = async ( req, res ) => {
  const orderId = req.params.id;
  // Validate user ID
  if ( !orderId ) {
    throw new BadRequestError( 'Order ID is required' );
  }

  const orders = await OrderService.findOrderById( orderId );

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
  const userRole = req.user.role;
  const orderId = req.params.id;
  const { status } = req.body;
  // Validate order ID
  if ( !orderId ) {
    throw new BadRequestError( 'Order ID is required' );
  }

  if ( userRole === USER_ROLES.CLIENT && status !== ORDER_STATUSES.CANCELLED ) {
    throw new ForbiddenError( 'User is not allowed to change the status' );
  }
  // Validate status
  if ( !status || !ORDER_STATUSES_ARRAY.includes( status ) ) {
    throw new ValidationError( `Status must be one of: ${ ORDER_STATUSES_ARRAY.join( ', ' ) }` );
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