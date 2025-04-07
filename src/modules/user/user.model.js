const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const { USER_ROLES_ARRAY, USER_ROLES, SALT_ROUNDS } = require( '../../utilities/constants' );
const { doHash, doHashValidation } = require( '../../utilities/auth' );

const userSchema = new mongoose.Schema( {
  firstName: {
    type: String,
    required: true,
    trim: true,
    default: null,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    default: null,
    select: false,
  },
  profilePhoto: {
    type: String,
    default: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1741285501~exp=1741289101~hmac=d629ec566545ef3b552d0a991e687ad2ed1aab9f352ae82b2df97cd3ad059148&w=740"
  },
  status: {
    type: String,
    enum: [ 'pending', 'registered', 'verified', 'blocked' ],
    default: 'pending'
  },
  otpVerified: {
    type: Boolean,
    default: false
  },
  roles: {
    type: String,
    enum: USER_ROLES_ARRAY,
    default: 'client'
  },
  authProviders: {
    local: {
      email: String,
      password: String
    },
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  activityLog: [
    {
      action: String,
      timestamp: Date,
      details: String
    }
  ]
}, { timestamps: true } );

// Hash password before saving
userSchema.pre( 'save', async function ( next ) {
  if ( !this.isModified( 'password' ) ) return next();
  this.password = await doHash( this.password, SALT_ROUNDS );
  next();
} );

// Validate password
userSchema.methods.isValidPassword = async function ( password ) {
  return await doHashValidation( password, this.password );
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign( { _id: this._id, roles: this.roles }, process.env.JWT_SECRET, { expiresIn: '1h' } );
  return token;
};

// Check if user is blocked
userSchema.methods.isBlocked = function () {
  return this.status === 'blocked';
};

// Check if user is verified
userSchema.methods.isVerified = function () {
  return this.status === 'verified';
};

// Get authentication provider details
userSchema.methods.getAuthProvider = function ( provider ) {
  if ( !this.authProviders[ provider ] ) {
    return null;
  }
  return this.authProviders[ provider ];
};

// Update last login time
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = Date.now();
  return this.save();
};

// Add activity log
userSchema.methods.addActivityLog = function ( action, details ) {
  this.activityLog.push( { action, timestamp: Date.now(), details } );
  return this.save();
};

const User = mongoose.model( 'User', userSchema );

module.exports = User;