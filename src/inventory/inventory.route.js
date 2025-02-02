const express = require( 'express' );
const inventoryController = require( './inventory.controller' );
const verifyToken = require( '../middlewares/verifyToken' );
const verifyAdmin = require( '../middlewares/verifyAdmin' );

const router = express.Router();


// Allow GET requests without admin check
router.get( "/get", inventoryController.fetchInventory );
router.get( "/get/:id", inventoryController.getSingleProduct );

// Admin only routes
router.use( verifyToken, verifyAdmin );

router.post( "/add", inventoryController.addToInventory );
router.route( "/edit/:id" )
    .patch( inventoryController.updateProduct )
    .put( inventoryController.updateProduct )
router.delete( "/delete/:id", inventoryController.deleteProduct );

module.exports = router;
