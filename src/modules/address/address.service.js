const addressModel = require( './address.model' );
const { NotFoundError } = require( '../../errors/customErrors' );

class AddressService {
    // Unset default flag for all other addresses
    static async unsetDefaultAddresses ( { userId, id } ) {
        return await addressModel.updateMany(
            { user: userId, _id: { $ne: id } },
            { isDefault: false }
        );
    }

    // Add a new address
    static async addAddress ( {
        userId = '',
        firstName = '',
        lastName = '',
        phoneNumber = '',
        street = '',
        city = '',
        state = '',
        country = '',
        zipCode = '',
        isDefault = false
    } ) {
        console.log( "🚀 ~ AddressService ~ addAddress ~ userId:", userId )
        const address = new addressModel( {
            user: userId,
            firstName,
            lastName,
            phoneNumber,
            street,
            city,
            state,
            country,
            zipCode,
            isDefault,
        } );

        return await address.save();
    }

    // Update an existing address
    static async updateAddress ( id, updateData ) {
        return await addressModel.findByIdAndUpdate( id, updateData, { new: true, runValidators: true } );
    }

    // Delete an address
    static async deleteAddress ( id ) {
        return await addressModel.findByIdAndDelete( id );
    }

    // Get all addresses for a user
    static async getAddresses ( userId ) {
        return await addressModel.find( { user: userId } ).sort( { createdAt: -1 } );
    }

    // Get address by ID
    static async getAddressById ( id ) {
        return await addressModel.findById( id );
    }
}

module.exports = AddressService;