const env = require( "../configs/env.config" );
/**
 * Payment statuses used in the application.
 * @constant
 * @type {Object}
 * @property {string} CREATED - Represents a created payment status.
 * @property {string} SAVED - Represents a saved payment status.
 * @property {string} APPROVED - Represents an approved payment status.
 * @property {string} VOIDED - Represents a voided payment status.
 * @property {string} COMPLETED - Represents a completed payment status.
 * @property {string} PAYER_ACTION_REQUIRED - Represents a payer action required payment status.
 */
exports.PAYMENT_STATUS = {
    CREATED: "Created",
    SAVED: "Saved",
    APPROVED: "Approved",
    VOIDED: "Voided",
    COMPLETED: "Completed",
    PAYER_ACTION_REQUIRED: "PayerActionRequired",
};

exports.PAYMENT_STATUS_ARRAY = Object.values( exports.PAYMENT_STATUS );

/**
 * Coupon statuses used in the application.
 * @constant
 * @type {Object}
 * @property {string} ACTIVE - Represents an active coupon status.
 * @property {string} IN_ACTIVE - Represents an inactive coupon status.
 */
exports.COUPON_STATUS = {
    ACTIVE: "active",
    IN_ACTIVE: "inActive",
};

exports.COUPON_STATUS_ARRAY = Object.values( exports.COUPON_STATUS );

/**
 * User roles used in the application.
 * @constant
 * @type {Object}
 * @property {string} CLIENT - Represents a client user role.
 * @property {string} ADMIN - Represents an admin user role.
 */
exports.USER_ROLES = {
    CLIENT: "client",
    ADMIN: "admin",
};

exports.USER_ROLES_ARRAY = Object.values( exports.USER_ROLES );

/**
 * Order statuses used in the application.
 * @constant
 * @type {Object}
 * @property {string} PROCESSING - Represents a processing order status.
 * @property {string} SHIPPED - Represents a shipped order status.
 * @property {string} DELIVERED - Represents a delivered order status.
 * @property {string} CANCELLED - Represents a cancelled order status.
 */
exports.ORDER_STATUSES = {
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
};

exports.ORDER_STATUSES_ARRAY = Object.values( exports.ORDER_STATUSES );

exports.INQUIRY_STATUS = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
};
exports.INQUIRY_STATUS_ARRAY = Object.values( exports.INQUIRY_STATUS );

exports.USER_STATUS = {
    PENDING: 'pending',
    REGISTERED: 'registered',
    VERIFIED: 'verified',
    BLOCKED: 'blocked'
}
exports.USER_STATUS_ARRAY = Object.values( exports.USER_STATUS );

//OTP Constants
const OTP_EXPIRATION_MINUTES = 10;
exports.OTP_EXPIRATION_MS = OTP_EXPIRATION_MINUTES * 60 * 1000;

exports.SALT_ROUNDS = 12;

exports.PROVIDER_FIELDS = {
    local: "local",
    google: "google",
    facebook: "facebook",
}

exports.PASSWORD_RESET_LINK = `${ env.FrontEndBaseURL }/reset-password/`
exports.REQUEST_PASSWORD_RESET_LINK = `${ env.FrontEndBaseURL }/verify-mail/`