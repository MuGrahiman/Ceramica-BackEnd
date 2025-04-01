const { doHash, doHashValidation, generateJWToken } = require('../../utilities/auth');
const { providerSelector } = require('../../utilities/providerSelector');
const { USER_STATUS } = require('../../utilities/constants');
const userModel = require('./user.model');

class UserService {
    static async registerUser(email, password) {
        const existingUser = await userModel.findOne({ email });
        
        if (existingUser) {
            if (existingUser.status === USER_STATUS.BLOCKED) {
                throw new AuthorizationError('Admin Blocked');
            }
            if (existingUser.status === USER_STATUS.VERIFIED) {
                throw new ValidationError('User already exists!');
            }
            if (existingUser.status === USER_STATUS.REGISTERED) {
                return existingUser;
            }
        }

        const hashedPassword = await doHash(password, 12);
        const newUser = new userModel({
            email,
            password: hashedPassword,
            status: USER_STATUS.REGISTERED
        });

        const result = await newUser.save();
        result.password = undefined;
        return result;
    }

    static async authenticateUser(email, password, uid, provider) {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            throw new NotFoundError('User not found!');
        }

        if (existingUser.status !== USER_STATUS.VERIFIED) {
            throw new AuthorizationError('User not verified');
        }
        if (existingUser.status === USER_STATUS.BLOCKED) {
            throw new AuthorizationError('Admin Blocked');
        }

        const currentValue = providerSelector(provider, {
            password,
            guId: uid,
            fbId: uid
        });
        
        const existingProviderValue = providerSelector(provider, {
            password: existingUser.password,
            guId: existingUser.guId,
            fbId: existingUser.fbId
        });

        if (existingProviderValue) {
            const isValid = await doHashValidation(currentValue, existingProviderValue);
            if (!isValid) {
                throw new AuthorizationError('Invalid credentials!');
            }
        } else {
            const property = providerSelector(provider, {
                password: 'password',
                guId: 'guId',
                fbId: 'fbId'
            });
            existingUser[property] = await doHash(currentValue, 12);
            await existingUser.save();
        }

        const token = await generateJWToken({ id: existingUser._id });
        return {
            token,
            user: existingUser.toObject()
        };
    }

    static async initiatePasswordReset(email) {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            throw new NotFoundError('User is not found!');
        }
        if (existingUser.status !== USER_STATUS.VERIFIED) {
            throw new AuthorizationError('User is not verified!');
        }
        if (existingUser.status === USER_STATUS.BLOCKED) {
            throw new AuthorizationError('Admin Blocked');
        }
        
        return existingUser._id;
    }
}

module.exports = UserService;