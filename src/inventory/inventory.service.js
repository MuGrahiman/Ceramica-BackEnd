// /services/inventory.service.js
const { default: mongoose } = require( 'mongoose' );
const inventoryModel = require( './inventory.model' );
// const { paginate } = require( '../utils/pagination' );

class InventoryService {
    static async createProduct ( data ) {
        const newProduct = new inventoryModel( data );
        await newProduct.save();
        return newProduct;
    }

    // Added fetchProducts method that includes filtering and sorting
    static async fetchProducts ( page, limit, filters = {}, sort = { createdAt: -1 } ) {
        const skip = ( page - 1 ) * limit;
        // const { skip } = paginate( page, limit );/
        const products = await inventoryModel.find( filters )
            .sort( sort )
            .skip( skip )
            .limit( limit );

        const count = await inventoryModel.countDocuments( filters ); // Count filtered documents

        return { products, count };
    }

    static async getProductById ( id ) {
        if ( !mongoose.Types.ObjectId.isValid( id ) ) {
            throw new Error( "Invalid product ID format" );
        }
        return await inventoryModel.findById( id );
    }

    static async updateProductById ( id, newData ) {
        if ( !mongoose.Types.ObjectId.isValid( id ) ) {
            throw new Error( "Invalid product ID format" );
        }
        return await inventoryModel.findByIdAndUpdate( id, newData, { new: true } );
    }


    static async deleteProductById ( id ) {
        if ( !mongoose.Types.ObjectId.isValid( id ) ) {
            throw new Error( "Invalid product ID format" );
        }
        return await inventoryModel.findByIdAndDelete( id );
    }
    // Other existing service methods can be added here...
}

module.exports = InventoryService;
