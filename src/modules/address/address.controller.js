const { ValidationError, ForbiddenError, NotFoundError } = require('../../errors/customErrors');
const { sendSuccessResponse } = require('../../utilities/responses');
const AddressService = require('./address.service');

// Add a new address
exports.addAddress = async (req, res) => {
    const { firstName, lastName, phoneNumber, street, city, state, country, zipCode, isDefault } = req.body;
    const userId = req.user.id;

    if (!firstName || !lastName || !phoneNumber || !street || !city || !state || !country || !zipCode) {
        throw new ValidationError('Invalid address data');
    }

    const address = await AddressService.addAddress({
        userId,
        firstName,
        lastName,
        phoneNumber,
        street,
        city,
        state,
        country,
        zipCode,
        isDefault,
    });

    if (!address) {
        throw new NotFoundError('Address not created');
    }

    if (isDefault) {
        await AddressService.unsetDefaultAddresses({ userId, id: address._id });
    }

    sendSuccessResponse(res, {
        message: 'Address added successfully',
        data: address,
    });
};

// Update an existing address
exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    if (!id || !updateData) {
        throw new ValidationError('Invalid address data');
    }

    const address = await AddressService.updateAddress(id, updateData);
    if (!address) {
        throw new NotFoundError('Address not found');
    }

    if (address.isDefault) {
        await AddressService.unsetDefaultAddresses({ userId, id: address._id });
    }

    sendSuccessResponse(res, {
        message: 'Address updated successfully',
        data: address,
    });
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        throw new ValidationError('Invalid address data');
    }

    const address = await AddressService.getAddressById(id);
    if (!address) {
        throw new NotFoundError('Address not found');
    }

    if (address.isDefault) {
        throw new ForbiddenError('Default address cannot be deleted');
    }

    const deletedAddress = await AddressService.deleteAddress(id);
    if (!deletedAddress) {
        throw new NotFoundError('Address not found');
    }

    sendSuccessResponse(res, {
        message: 'Address deleted successfully',
    });
};

// Set an address as default
exports.setDefaultAddress = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
        throw new ValidationError('Invalid address data');
    }

    const address = await AddressService.updateAddress(id, { isDefault: true });
    if (!address) {
        throw new NotFoundError('Address not found');
    }

    await AddressService.unsetDefaultAddresses({ userId, id: address._id });

    sendSuccessResponse(res, {
        message: 'Default address updated successfully',
        data: address,
    });
};

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
    const userId = req.user.id;

    const addresses = await AddressService.getAddresses(userId);
    sendSuccessResponse(res, {
        message: 'Addresses retrieved successfully',
        data: addresses,
    });
};