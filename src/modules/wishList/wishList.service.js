// /services/wishlist.service.js
const { default: mongoose } = require('mongoose');
const wishlistModel = require('./wishList.model');
const { ValidationError } = require('../../errors/customErrors');

// Utility function to validate MongoDB IDs
const verifyMongoId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid ID format');
    }
    return id;
};

class WishListService {
    // Add to wishlist
    static async addToWishlist({ userId, productId }) {
        verifyMongoId(productId);
        const newWishlistItem = new wishlistModel({ user: userId, inventory: productId });
        await newWishlistItem.save();
        return newWishlistItem;
    }

    // Get wishlist
    static async getWishlist(data) {
        return await wishlistModel.find(data).populate('inventory');
    }

    // Find a single wishlist item
    static async findWishlistItem({ userId, productId }) {
        verifyMongoId(productId);
        return await wishlistModel.findOne({ user: userId, inventory: productId });
    }

    // Remove from wishlist
    static async removeFromWishlist({ userId, productId }) {
        verifyMongoId(productId);
        return await wishlistModel.findOneAndDelete({ user: userId, inventory: productId });
    }
}

module.exports = WishListService;