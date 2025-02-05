const { default: mongoose } = require('mongoose');
const cartModel = require('./cart.model');
const { ValidationError } = require('../../errors/customErrors');

// Utility function to validate MongoDB IDs
const verifyMongoId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid ID format');
    }
    return id;
};

class CartService {
    // Add to cart
    static async addToCart({ userId, productId, quantity }) {
        verifyMongoId(productId);
        const newCartItem = new cartModel({ user: userId, inventory: productId, quantity });
        await newCartItem.save();
        return newCartItem;
    }

    // Get cart
    static async getCart(data) {
        return await cartModel.find(data).populate('inventory');
    }

    // Find a single cart item
    static async findCartItem({ userId, productId }) {
        verifyMongoId(productId);
        return await cartModel.findOne({ user: userId, inventory: productId });
    }

    // Update cart item
    static async updateCartItem({ userId, productId, quantity }) {
        verifyMongoId(productId);
        return await cartModel.findOneAndUpdate(
            { user: userId, inventory: productId },
            { quantity },
            { new: true, runValidators: true }
        );
    }

    // Remove from cart
    static async removeFromCart(cartId) {
        verifyMongoId(cartId);
        return await cartModel.findByIdAndDelete(cartId);
    }
}

module.exports = CartService;