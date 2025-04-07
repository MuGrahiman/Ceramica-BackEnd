const { doHash, doHashValidation, generateJWToken } = require( '../../utilities/auth' );
const { providerSelector } = require( '../../utilities/providerSelector' );
const { USER_STATUS, SALT_ROUNDS } = require( '../../utilities/constants' );
const userModel = require( "./user.model" );
const { query } = require( 'express' );

class UserService {
    static async registerUser ( { email, password, firstName, lastName } ) {
        const hashedPassword = await doHash( password, SALT_ROUNDS );

        const local = {
            email,
            password: hashedPassword
        };

        const newUser = new userModel( {
            email, password, firstName, lastName,
            status: USER_STATUS.REGISTERED,
            authProviders: { local }
        } );

        const savedUser = await newUser.save();
        await savedUser.addActivityLog( 'register', 'User registered successfully' );
        return savedUser;

    }

    static async findUser ( query = {} ) {
        return await userModel.findOne( query )

    }

    // static async authenticateUser ( email, password, uid, provider ) {
    //     const existingUser = await userModel.findOne( { email } );
    //     return {
    //         token,
    //         user: existingUser.toObject()
    //     };
    // }

    static async updateUser ( userId, updateFields ) {
        return userModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );
    }

    static async fetchUsers ( query = {}, sort = { createdAt: -1 } ) {
        return userModel.find( {
            roles: { $ne: 'admin' },
            ...query
        } )
            .select( '-password' )
            .sort( sort );
    }
}

module.exports = UserService;