const { doHash, generateJWToken, doHashValidation } = require( '../../utilities/auth' );
const { USER_STATUS, SALT_ROUNDS } = require( '../../utilities/constants' );
const userModel = require( '../user/user.model' )
const UserRepository = require( './user.repository' );
const {
    ValidationError,
    UnauthorizedError,
    NotFoundError,
    AuthorizationError
} = require( '../../errors/customErrors' );

class UserService {
    constructor ( repository = UserRepository ) {
        this.repository = repository;
    }

    async registerUser ( { email, password, firstName, lastName } ) {
        const existingUser = await this.repository.findUser( { email } );

        if ( existingUser ) {
            if ( this.repository.isBlocked( existingUser ) ) {
                throw new UnauthorizedError( 'Account is blocked by admin' );
            }
            if ( this.repository.isVerified( existingUser ) ) {
                throw new ValidationError( 'User already exists' );
            }
            return existingUser;
        }

        const hashedPassword = await doHash( password, SALT_ROUNDS );
        const newUser = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            status: USER_STATUS.REGISTERED,
            authProviders: { local: { email, password: hashedPassword } }
        };

        const savedUser = await this.repository.createUser( newUser );
        await this.repository.addActivityLog( savedUser, 'register', 'User registered successfully' );
        return savedUser;
    }


    async loginUser ( { email, password, uid, provider } ) {
        const user = await this.repository.findUser( { email } );
        if ( !user ) throw new NotFoundError( 'User not found' );

        this.validateUserStatus( user );

        const providerValues = {
            local: password,
            google: uid,
            facebook: uid,
        };

        const currentAuthValue = providerValues[ provider ];
        if ( !currentAuthValue ) throw new ValidationError( 'Invalid auth provider' );

        const userAuthValue = await this.repository.getAuthProvider( user, provider );
        if ( !userAuthValue ) throw new ValidationError( 'Auth provider not configured' );

        const { email: existMail, ...existingValue } = userAuthValue;
        const [ existingAuthValue ] = Object.values( existingValue );

        if ( typeof existingAuthValue === 'string' && existingAuthValue.trim() !== '' ) {
            const isValid = await doHashValidation( currentAuthValue, existingAuthValue );
            if ( !isValid ) throw new AuthorizationError( 'Invalid credentials' );
            await this.repository.addActivityLog( user, 'Logged in', `User logged in via ${ provider }` );
        } else {
            user.authProviders[ provider ].id = await doHash( uid, SALT_ROUNDS );
            await this.repository.save( user );
            await this.repository.addActivityLog( user, 'First login', `First login via ${ provider }` );
        }

        const token = await generateJWToken( { id: user._id } );
        await this.repository.updateLastLogin( user );

        return {
            user: user.toObject(),
            token
        };
    }

    async validateUserStatus ( user ) {
        if ( await this.repository.isBlocked( user ) )
            throw new UnauthorizedError( 'Account blocked' );
        if ( await !this.repository.isVerified( user ) )
            throw new UnauthorizedError( 'Account not verified' );
    }

    async fetchUsers ( { status, searchTerm, sort } ) {
        // Construct search query
        const searchQuery = searchTerm ? {
            $or: [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { status: { $regex: searchTerm, $options: 'i' } }
            ]
        } : {};
        // Construct filter for status
        const statusFilter = status && status.length
            ? Array.isArray( status ) ? { $in: status } : { status }
            : {};
        const query = { ...searchQuery, ...statusFilter, roles: { $ne: 'admin' } };
        // return this.model.find( {
        //     roles: { $ne: 'admin' },
        //     ...query
        // } )
        //     .select( '-password' )
        //     .sort( sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 } );

        return await this.repository.fetchUsers(
            query, sort === 'oldest' ?
            { createdAt: 1 } :
            { createdAt: -1 }
        );
    }

    async updateUserStatus ( userId, status ) {
        const user = await this.repository.findUser( { _id: userId } );
        if ( !user ) throw new NotFoundError( 'User not found' );

        let newStatus;
        if ( status.toLowerCase() === 'block' ) {
            newStatus = USER_STATUS.BLOCKED;
        } else if ( status.toLowerCase() === 'unblock' ) {
            newStatus = user.otpVerified ? USER_STATUS.VERIFIED : USER_STATUS.REGISTERED;
        } else {
            throw new ValidationError( 'Invalid status' );
        }

        const updatedUser = await this.repository.updateUser( userId, { status: newStatus } );
        if ( !updatedUser ) throw new NotFoundError( 'User not found' );

        await this.repository.addActivityLog( updatedUser,
            'Status update', `Status changed to ${ newStatus }` );
        return updatedUser;
    }

    async initiatePasswordReset ( email ) {
        const user = await this.repository.findUser( { email } );
        if ( !user ) throw new NotFoundError( 'User not found' );
        this.validateUserStatus( user );
        return { userId: user._id };
    }
}

module.exports = new UserService();