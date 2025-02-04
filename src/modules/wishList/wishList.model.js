const mongoose = require( "mongoose" );

// wishlist.model.js
const wishListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
});
const WishList = mongoose.model('WishList', wishListSchema);
module.exports = WishList;