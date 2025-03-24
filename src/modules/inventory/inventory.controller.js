// controllers/inventory.controller.js
const { NotFoundError } = require( "../../errors/customErrors" );
const { sendSuccessResponse } = require( "../../utilities/responses" );
const {  getSortOptions } = require( "../../utilities/sort" );
const inventoryService = require( "./inventory.service" );

// Add product to inventory
exports.addToInventory = async ( req, res ) => {
    const productData = req.body; // TODO: Validate the body
    const newProduct = await inventoryService.createProduct( { ...productData } );
    if ( !newProduct ) {
        throw new NotFoundError( "Failed to add product to inventory" );
    }

    sendSuccessResponse( res, {
        statusCode: 201,
        message: "Product added to inventory successfully",
        data: newProduct,
    } );
};

// Fetch all products
exports.fetchInventory = async ( req, res ) => {
    //TODO: Check the product status based on the user role
    const {
        page: queryPage,
        limit: queryLimit,
        search: searchTerm,
        minPrice,
        maxPrice,
        category,
        size,
        sort,
    } = req.query;

    const page = Math.max( 1, parseInt( queryPage, 10 ) || 1 );
    const limit = Math.max( 1, parseInt( queryLimit, 10 ) || 10 );
    const skip = ( page - 1 ) * limit;

    const search = searchTerm
        ? {
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { category: { $regex: searchTerm, $options: "i" } },
                { size: { $regex: searchTerm, $options: "i" } },
            ],
        }
        : {};

    const filters = {};
    if ( category && category.length ) {
        filters.category = Array.isArray( category ) ? { $in: category } : category;
    }
    if ( size && size.length ) {
        filters.size = Array.isArray( size ) ? { $in: size } : size;
    }
    if ( minPrice || maxPrice ) {
        filters.price = {};
        if ( minPrice ) filters.price.$gte = Number( minPrice );
        if ( maxPrice ) filters.price.$lte = Number( maxPrice );
    }

    const sortOptions = getSortOptions( sort )

    const products = await inventoryService.fetchProducts( page, limit, filters, sortOptions, search );
    sendSuccessResponse( res, {
        data: {
            products: products.products,
            totalProducts: products.count,
            totalPages: Math.ceil( products.count / limit ),
            currentPage: page,
        },
    } );
};

// Get single product by ID
exports.getSingleProduct = async ( req, res ) => {
    const { id } = req.params;
    const product = await inventoryService.getProductById( id );

    if ( !product ) {
        throw new NotFoundError( "Product not found!" );
    }

    sendSuccessResponse( res, { data: product } );
};

// Update product by ID
exports.updateProduct = async ( req, res ) => {
    const { id } = req.params;
    const { newData } = req.body; // TODO: Validate the data
    const updatedProduct = await inventoryService.updateProductById( id, newData );
    if ( !updatedProduct ) {
        throw new NotFoundError( "Product not found!" );
    }

    sendSuccessResponse( res, {
        message: "Product updated successfully.",
        data: updatedProduct,
    } );
};

// Delete product by ID
exports.deleteProduct = async ( req, res ) => {
    const { id } = req.params;
    const deletedProduct = await inventoryService.deleteProductById( id );

    if ( !deletedProduct ) {
        throw new NotFoundError( "Product not found!" );
    }

    sendSuccessResponse( res, {
        message: "Product deleted successfully",
        data: deletedProduct,
    } );
};