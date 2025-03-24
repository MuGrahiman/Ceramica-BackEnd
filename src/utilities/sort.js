exports.getSortOptions = ( sort ) => {
    let sortOptions = { createdAt: -1 }; // Default sorting
    switch ( sort ) {
        case "newest":
            sortOptions = { createdAt: -1 };
            break;
        case "oldest":
            sortOptions = { createdAt: 1 };
            break;
        case "price_desc":
            sortOptions = { price: -1 };
            break;
        case "price_asc":
            sortOptions = { price: 1 };
            break;
    }
    return sortOptions
}
