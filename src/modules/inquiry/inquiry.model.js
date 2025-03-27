const mongoose = require('mongoose');
const { INQUIRY_STATUS_ARRAY, INQUIRY_STATUS } = require( '../../utilities/constants' );

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: INQUIRY_STATUS_ARRAY,
        default: INQUIRY_STATUS.PENDING
    },
}, {
    timestamps: true,
});


const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;