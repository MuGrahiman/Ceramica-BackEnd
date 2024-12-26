const inventoryModel = require( "./inventory.model" );

exports.addToInventory = async ( req, res ) => {
    //* req.user === admin 

    try {
        const newProduct = await inventoryModel( { ...req.body } );
        await newProduct.save();
        res.status( 200 ).json( { success: true, message: "Product added to inventory successfully", book: newProduct } )
    } catch ( error ) {
        console.error( "Error creating book", error );
        res.status( 500 ).json( { success: false, message: "Failed to create book" } )
    }
}

// get all books
exports.fetchInventory = async ( req, res ) => {
    const page = parseInt( req.query.page ) || 1; 
    const limit = parseInt( req.query.limit ) || 10;
    const skip = ( page - 1 ) * limit; 

    try {
        const products = await inventoryModel
            .find()
            .sort( { createdAt: -1 } )
            .skip( skip )
            .limit( limit );
        const count = await inventoryModel.countDocuments(); 

        res.status( 200 ).json( {
            products,
            totalPages: Math.ceil( count / limit ),
            currentPage: page,
        } );

    } catch ( error ) {
        console.error( "Error fetching books", error );
        res.status( 500 ).json( { success: true, message: "Failed to fetch books" } )
    }
}

exports.getSingleBook = async ( req, res ) => {
    try {
        const { id } = req.params;
        const book = await inventoryModel.findById( id );
        if ( !book ) {
            res.status( 404 ).json( { success: false, message: "Book not Found!" } )
        }
        res.status( 200 ).json( book )

    } catch ( error ) {
        console.error( "Error fetching book", error );
        res.status( 500 ).json( { success: false, message: "Failed to fetch book" } )
    }

}

// update book data
exports.updateBook = async ( req, res ) => {
    const { id } = req.params;

    const { newData } = req.body
    try {
        // Attempt to update the book in the inventory
        const updatedBook = await inventoryModel.findByIdAndUpdate( id, newData, { new: true } );

        // If the book is not found, return a 404 error
        if ( !updatedBook ) {
            return res.status( 404 ).json( {
                success: false,
                message: "Product not found."
            } );
        }

        // Return success response with updated book details
        return res.status( 200 ).json( {
            success: true,
            message: "Book updated successfully.",
            book: updatedBook
        } );
    } catch ( error ) {
        console.error( "Error updating book:", error );

        // Return a 500 error for any unexpected issues
        return res.status( 500 ).json( {
            success: false,
            message: "Failed to update the book."
        } );
    }
};


exports.deleteABook = async ( req, res ) => {
    try {
        const { id } = req.params;
        const deletedBook = await inventoryModel.findByIdAndDelete( id );
        if ( !deletedBook ) {
            return res.status( 404 ).json( { success: false, message: "Book is not Found!" } )
        }
        return res.status( 200 ).json( {
            success: true,
            message: "Book deleted successfully",
            book: deletedBook
        } )
    } catch ( error ) {
        console.error( "Error deleting a book", error );
        return res.status( 500 ).json( { success: false, message: "Failed to delete a book" } )
    }
};
