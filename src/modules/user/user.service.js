const { doHash, doHashValidation, generateJWToken } = require( '../../utilities/auth' );
const { providerSelector } = require( '../../utilities/providerSelector' );
const { USER_STATUS } = require( '../../utilities/constants' );
const userModel = require( "../users/user.model" );
const { query } = require( 'express' );

class UserService {
    static async registerUser ( email, password ) {
        const newUser = new userModel( {
            email,
            password,
            status: USER_STATUS.REGISTERED
        } );

        const result = await newUser.save();
        result.password = undefined;
        return result;
    }

    static async findUser ( query = {} ) {
        return await userModel.findOne( query );
    }

    static async authenticateUser ( email, password, uid, provider ) {
        const existingUser = await userModel.findOne( { email } );
        return {
            token,
            user: existingUser.toObject()
        };
    }
    
    static async updateUser(userId, updateFields) {
        return userModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );
    }
}

module.exports = UserService;