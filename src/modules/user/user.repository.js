// src/user/UserRepository.js

const userModel = require( '../user/user.model' )

class UserRepository {
    async findUser ( query = {} ) {
        return await userModel.findOne( query );
    }

    async createUser ( userData ) {
        const newUser = new userModel( userData );
        return await newUser.save();
    }

    async updateUser ( userId, updateFields ) {
        return await userModel.findByIdAndUpdate( userId, updateFields, { new: true } );
    }

    async fetchUsers ( filter, sort ) {
        return await userModel.find( filter ).select( '-password' ).sort( sort );
    }

    async isBlocked ( user ) {
        return await user.isBlocked();
    }

    async isVerified ( user ) {
        return user.isVerified();
    }

    async getAuthProvider ( user, provider ) {
        return user.getAuthProvider( provider );
    }

    async addActivityLog ( user, action, message ) {
        return user.addActivityLog( action, message );
    }

    async saveUser ( user ) {
        return user.save();
    }

    async updateLastLogin ( user ) {
        return user.updateLastLogin();
    }

}

module.exports = new UserRepository();