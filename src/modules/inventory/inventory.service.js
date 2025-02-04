// /services/inventory.service.js
const { default: mongoose } = require( 'mongoose' );
const inventoryModel = require( './inventory.model' );
const { ValidationError } = require( '../../errors/customErrors' );

const verifyMongoId = ( id ) => {
    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        throw new ValidationError( "Invalid product ID format" );
    }
    return id;
};

class InventoryService {
    static async createProduct ( data ) {
        const newProduct = new inventoryModel( data );
        await newProduct.save();
        return newProduct;
    }

    // Added fetchProducts method that includes filtering and sorting
    static async fetchProducts ( page, limit, filters = {}, sort = { createdAt: -1 }, search = {} ) {
        const skip = ( page - 1 ) * limit;
        const filterOptions = { ...filters, ...search }
        const products = await inventoryModel.find( filterOptions )
            .sort( sort )
            .skip( skip )
            .limit( limit );

        const count = await inventoryModel.countDocuments( filterOptions ); // Count filtered documents

        return { products, count };
    }

    static async getProductById ( id ) {
        await verifyMongoId( id )
        return await inventoryModel.findById( id );
    }

    static async updateProductById ( id, newData ) {
        await verifyMongoId( id )
        return await inventoryModel.findByIdAndUpdate( id, newData, { new: true, runValidators: true } );
    }

    static async deleteProductById ( id ) {
        await verifyMongoId( id )
        return await inventoryModel.findByIdAndDelete( id );
    }
    // Other existing service methods can be added here...
}

module.exports = InventoryService;
