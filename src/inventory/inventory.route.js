const express = require( 'express' );
const Book = require( './inventory.model' );
const inventoryController = require( './inventory.controller' );
const verifyAdminToken = require( '../middlewares/verifyToken' );
const router = express.Router();

/**
 * Need to create an helper function for checking the user is admin or not . 
 * 
 * Create the helper for check the body values by creating schema
 * 
 */

// get all books
router.get( "/get", inventoryController.fetchInventory );

// get single book endpoint
router.get( "/get/:id", inventoryController.getSingleProduct );

// post a book
router.post( "/add", inventoryController.addToInventory )

// update a book endpoint
router.put( "/edit/:id", inventoryController.updateProduct );

router.delete( "/delete/:id", inventoryController.deleteProduct )


module.exports = router;  
