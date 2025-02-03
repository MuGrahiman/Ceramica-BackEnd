const express = require( 'express' );
const cartController = require( './cart.controller' );
const verifyToken = require( '../../middlewares/verifyToken' );
const router = express.Router();

router.get( '/:user_id', cartController.getCart );
router.post( '/add', cartController.addToCart );
router.delete( '/remove/:user_id/:product_id', cartController.removeFromCart );
router.put( '/update/:user_id/:product_id', cartController.updateCartItem );// req.user == user_id


module.exports = router;  
