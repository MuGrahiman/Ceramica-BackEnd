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
    static async fetchProducts ( page, limit, filters = {}, sort = { createdAt: -1 }, search = {} ) {
        const skip = ( page - 1 ) * limit;
        const filterOptions = { ...filters, ...search };

        const productsWithStats = await inventoryModel.aggregate( [
            // Apply filters and search
            { $match: filterOptions },

            // Sort
            { $sort: sort },

            // Pagination
            { $skip: skip },
            { $limit: limit },

            // Lookup reviews
            {
                $lookup: {
                    from: 'reviews', 
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            },

            // Add review stats
            {
                $addFields: {
                    totalCount: { $size: '$reviews' },
                    averageRating: {
                        $cond: [
                            { $gt: [ { $size: '$reviews' }, 0 ] },
                            { $round: [ { $avg: '$reviews.rating' }, 2 ] },
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                  reviews: 0 
                }
              }
              
        ] );

        // Get total count of matching products for pagination
        const count = await inventoryModel.countDocuments( filterOptions );

        return { products: productsWithStats, count };
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
