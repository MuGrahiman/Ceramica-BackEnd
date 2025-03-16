
exports.applyDiscountToItems = ( items, discountPercentage ) => {
    let originalTotal = items.reduce( ( total, item ) => total + item.price * item.quantity, 0 );
    let adjustedItems = [];

    // Calculate the total discount amount
    const totalDiscount = ( discountPercentage / 100 ) * originalTotal;

    // Calculate the target amount (after discount)
    const targetAmount = originalTotal - totalDiscount;

    // Distribute the discount proportionally to each item
    items.forEach( item => {
        const itemOriginalTotal = item.price * item.quantity; // Total price for this item
        const itemDiscount = ( itemOriginalTotal * discountPercentage ) / 100;
        const adjustedItemPrice = item.price - ( itemDiscount / item.quantity ); // Adjust the price by itemDiscount

        adjustedItems.push( {
            ...item,
            price: parseFloat( adjustedItemPrice.toFixed( 2 ) ), // Round to two decimals
        } );
    } );

    const adjustedTotal = adjustedItems.reduce( ( total, item ) => total + item.price * item.quantity, 0 ); // Calculate new total amount

    // Return adjusted items and check if they add up to the expected total amount
    return {
        adjustedItems,
        adjustedTotal,
    };
}
