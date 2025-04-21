const { doHash, generateJWToken, doHashValidation, verifyJWToken } = require( '../../utilities/auth' );
const { USER_STATUS, SALT_ROUNDS, PASSWORD_RESET_LINK, REQUEST_PASSWORD_RESET_LINK } = require( '../../utilities/constants' );
const userModel = require( '../user/user.model' )
const UserRepository = require( './user.repository' );
const {
    ValidationError,
    UnauthorizedError,
    NotFoundError,
    AuthorizationError
} = require( '../../errors/customErrors' );
const { sendMail } = require( '../../utilities/mailer' );

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
            password: password,
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
            if ( !isValid ) throw new UnauthorizedError( 'Invalid credentials' );
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

    async updateUser ( userId, body ) {
        if ( !userId ) throw new ValidationError( 'User id required' );
        const user = await this.repository.findUser( { _id: userId } );
        if ( !user ) throw new NotFoundError( 'User not found' );

        // Assuming `user` contains the updated fields
        let updateData = {};

        // Check if each field is provided and add it to the updateData object
        if ( body.firstName ) {
            updateData.firstName = body.firstName;
        }

        if ( body.lastName ) {
            updateData.lastName = body.lastName;
        }

        if ( body.profilePhoto ) {
            updateData.profilePhoto = body.profilePhoto;
        }

        // Check if any data is provided to update
        if ( Object.keys( updateData ).length === 0 ) {
            throw new ValidationError( 'No data provided for update' );
        }

        const updatedUser = await this.repository.updateUser( userId, updateData );
        if ( !updatedUser ) throw new NotFoundError( 'User not found' );

        await this.repository.addActivityLog( updatedUser,
            'Account update',
            `Successfully updated ${ Object.keys( updateData ).join( ', ' ) } user account fields ` );
        return updatedUser;
    }

    async initiateResetPassword ( email ) {
        const user = await this.repository.findUser( { email } );
        if ( !user ) throw new NotFoundError( 'User not found' );
        this.validateUserStatus( user );
        const token = await generateJWToken( { id: user._id }, '10m' );
        // const resetLink = `${ process.env.BASE_URL }/reset-password/${ token }`;
        const resetLink = PASSWORD_RESET_LINK.concat( token );
        const emailSubject = 'Password Reset Link';
        const emailBody = `
    <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>You have requested a password reset. 
            <a href="${ resetLink }" target="_blank" rel="noopener noreferrer">
                <strong>
              Please click this link to reset your password.</strong>
            </a>
        </p>
        <p>This link will expire in 10 minutes. If you do not reset your password within this time, you will need to 
            <a href="${ REQUEST_PASSWORD_RESET_LINK }" target="_blank" rel="noopener noreferrer">
                <strong>request a new reset link.</strong>
            </a>
        </p>
        <p><strong>Please do not share this link with anyone.</strong> Your security is our priority, and sharing this link may compromise your account.</p>
        <p>If you did not request this, please ignore this email to ensure your account remains secure.</p>
        <p>Thank you!</p>
    `;


        const info = await sendMail(
            email,
            emailSubject,
            emailBody
        );
        if ( info.accepted[ 0 ] !== email ) {
            throw new ValidationError( 'Failed to password reset link' );
        }
        return { token };
    }

    async applyResetPassword ( token, body ) {
        if ( !token ) throw new ValidationError( 'Token is required' );
        if ( !body ) throw new ValidationError( 'Data is required' );
        const data = await verifyJWToken( token, 'Please verify your mail again' );
        const user = await this.repository.findUser( { _id: data.id }, '+password' );
        if ( !user ) throw new NotFoundError( 'User not found' );
        this.validateUserStatus( user );

        const {
            // currentPassword,
            password,
            confirmPassword,
        } = body
        if ( !password || !confirmPassword )
            throw new ValidationError( 'Password changing field are missing' )

        const isSame = await doHashValidation( password, user.password );
        if ( isSame ) throw new ValidationError( 'Please Enter New password' );

        if ( password !== confirmPassword ) throw new ValidationError( 'Passwords not matching' );

        const hashedPassword = await doHash( password, SALT_ROUNDS );
        const updatedUser = await this.repository.updateUser( user._id,
            { password: hashedPassword, authProviders: { local: { password: hashedPassword } } } );
        if ( !updatedUser ) throw new NotFoundError( 'Password not updated' );

        await this.repository.addActivityLog( updatedUser, 'Reset Password',
            `Password Reset successfully` );
        return updatedUser;
    }

    async VerifyPassword ( userId, body ) {
        if ( !userId ) throw new ValidationError( 'User id required' );
        const { currentPassword, newPassword, confirmPassword } = body
        if ( !currentPassword || !newPassword || !confirmPassword )
            throw new ValidationError( 'Password changing field are missing' );

        const user = await this.repository.findUser( { _id: userId }, '+password' );
        if ( !user ) throw new NotFoundError( 'User not found' );

        this.validateUserStatus( user );

        const isValid = await doHashValidation( currentPassword, user.password );
        if ( !isValid ) throw new ValidationError( 'Password not valid' );

        const isSame = await doHashValidation( newPassword, user.password );
        if ( isSame ) throw new ValidationError( 'Please Enter New password' );

        if ( newPassword !== confirmPassword ) throw new ValidationError( 'Passwords not matching' );

        const hashedPassword = await doHash( newPassword, SALT_ROUNDS );
        const updatedUser = await this.repository.updateUser( user._id,
            { password: hashedPassword, authProviders: { local: { password: hashedPassword } } } );
        if ( !updatedUser ) throw new NotFoundError( 'Password not updated' );

        await this.repository.addActivityLog( updatedUser, 'Change Password',
            `Password changed successfully` );

        return updatedUser;
    }


}

module.exports = new UserService();