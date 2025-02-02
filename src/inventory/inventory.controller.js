const inventoryService = require( "./inventory.service" );

exports.addToInventory = async ( req, res ) => {
console.log("🚀 ~ exports.addToInventory= ~ req:", req.body)

    try {
        const newProduct = await inventoryService.createProduct( { ...req.body } );
        return res.status( 201 ).json( {
            success: true,
            message: "Product added to inventory successfully",
            product: newProduct,
        } );
    } catch ( error ) {
        console.error( "Error adding product to inventory", error );

        return res.status( 500 ).json( {
            success: false,
            message: "Failed to add product to inventory. Please try again.",
            error: error.message,
        } );
    }
}

// get all books
exports.fetchInventory = async ( req, res ) => {
    // Query parameter validation TODO:make it as an helper
    const {
        page: queryPage,
        limit: queryLimit,
        search: searchTerm,
        minPrice, maxPrice,
        category, size, sort
    } = req.query
    const page = Math.max( 1, parseInt( queryPage, 10 ) || 1 ); // Ensure page is at least 1
    const limit = Math.max( 1, parseInt( queryLimit, 10 ) || 10 ); // Ensure limit is at least 1
    const skip = ( page - 1 ) * limit;
    const search = searchTerm ? {
        $or: [
            { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive searchTerm
            { category: { $regex: searchTerm, $options: 'i' } },
            { size: { $regex: searchTerm, $options: 'i' } },
        ]
    } : {};

    const filters = {}
    // Handle category filter
    if ( category && category.length ) {
        filters.category = Array.isArray( category ) ? { $in: category } : category;
    }
    // Handle size filter
    if ( size && size.length ) {
        filters.size = Array.isArray( size ) ? { $in: size } : size;
    }
    // Handle price range filter
    if ( minPrice || maxPrice ) {
        filters.price = {};
        if ( minPrice ) filters.price.$gte = Number( minPrice );
        if ( maxPrice ) filters.price.$lte = Number( maxPrice );
    }
    let sortOptions = {};
    switch ( sort ) {
        case 'newest':
            sortOptions = { createdAt: -1 }; // Assuming you have a createdAt field
            break;
        case 'oldest':
            sortOptions = { createdAt: 1 };
            break;
        case 'price_desc':
            sortOptions = { price: -1 }; // Assuming you have a price field
            break;
        case 'price_asc':
            sortOptions = { price: 1 };
            break;
        default:
            sortOptions = {}; // Default sorting (if needed)
            break;
    }
    try {
        const products = await inventoryService.fetchProducts( page, limit, filters, sortOptions, search )
        return res.status( 200 ).json( {
            products: products.products,
            totalProducts: products.count,
            totalPages: Math.ceil( products.count / limit ),//TODO: Make it as helper in utility
            currentPage: page,
        } );

    } catch ( error ) {
        console.error( "Error fetching products:", error );
        return res.status( 500 ).json( {
            success: false,
            message: "Failed to fetch products.",
            error: error.message
        } );
    }
}

// /controllers/inventory.controller.js
exports.getSingleProduct = async ( req, res ) => {
    try {
        const { id } = req.params;
        const product = await inventoryService.getProductById( id );

        // Return 404 if product is not found
        if ( !product ) {
            return res.status( 404 ).json( { success: false, message: "Product not found!" } );
        }


        // Successfully found the product
        return res.status( 200 ).json( { success: true, product } );

    } catch ( error ) {
        console.error( `Error fetching product with ID ${ req.params.id }:`, error );
        if ( error.message === "Invalid product ID format" ) {
            return res.status( 400 ).json( {
                success: false,
                message: error.message
            } );
        }
        return res.status( 500 ).json( {
            success: false,
            message: "Failed to fetch product."
        } );
    }
};


// update book data
exports.updateProduct = async ( req, res ) => {
    const { id } = req.params;
    const newData = req.body;
    console.log("🚀 ~ exports.updateProduct= ~ newData:", newData)
    try {
        // Attempt to update the book in the inventory
        const updatedProduct = await inventoryService.updateProductById( id, newData );

        // If the book is not found, return a 404 error
        if ( !updatedProduct ) {
            return res.status( 404 ).json( {
                success: false,
                message: "Product not found."
            } );
        }

        // Return success response with updated book details
        return res.status( 200 ).json( {
            success: true,
            message: "Product updated successfully.",
            product: updatedProduct // Change from book to product
        } );
    } catch ( error ) {
        console.error( `Error updating product with ID ${ id }:`, error );

        if ( error.message === "Invalid product ID format" ) {
            return res.status( 400 ).json( {
                success: false,
                message: error.message
            } );
        }

        return res.status( 500 ).json( {
            success: false,
            message: "Failed to update the product."
        } );
    }
};

exports.deleteProduct = async ( req, res ) => {
    try {
        const { id } = req.params;

        const deletedProduct = await inventoryService.deleteProductById( id );

        if ( !deletedProduct ) {
            return res.status( 404 ).json( { success: false, message: "Product not found!" } );
        }

        return res.status( 200 ).json( {
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct // Change from book to product
        } );
    } catch ( error ) {
        console.error( `Error deleting product with ID ${ req.params.id }:`, error );

        if ( error.message === "Invalid product ID format" ) {
            return res.status( 400 ).json( {
                success: false,
                message: error.message
            } );
        }

        return res.status( 500 ).json( {
            success: false,
            message: "Failed to delete the product."
        } );
    }
};