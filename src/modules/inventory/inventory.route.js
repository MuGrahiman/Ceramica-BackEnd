const express = require( "express" );
const asyncHandler = require( "express-async-handler" );
const inventoryController = require( "./inventory.controller" );
const verifyToken = require( "../../middlewares/verifyToken" );
const verifyAdmin = require( "../../middlewares/verifyAdmin" );

const router = express.Router();

// Allow GET requests without admin check
router.get( "/get", asyncHandler( inventoryController.fetchInventory ) );
router.get( "/get/:id", asyncHandler( inventoryController.getSingleProduct ) );

// Admin only routes
router.use( verifyToken, verifyAdmin );

router.post( "/add", asyncHandler( inventoryController.addToInventory ) );
router
    .route( "/edit/:id" )
    .patch( asyncHandler( inventoryController.updateProduct ) )
    .put( asyncHandler( inventoryController.updateProduct ) );
router.delete( "/delete/:id", asyncHandler( inventoryController.deleteProduct ) );

module.exports = router;