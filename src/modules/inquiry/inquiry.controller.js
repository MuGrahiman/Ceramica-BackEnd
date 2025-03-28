const { NotFoundError, ValidationError } = require( '../../errors/customErrors' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const InquiryService = require( './inquiry.service' );
const { INQUIRY_STATUS } = require( '../../utilities/constants' );
const { sendMail } = require( '../../utilities/mailer' );

exports.createInquiry = async ( req, res ) => {
    const { name, email, subject, message } = req.body;

    if ( !name || !email || !subject || !message ) {
        throw new ValidationError( 'Name, email, subject, and message are required' );
    }

    const inquiryData = {
        name,
        email,
        subject,
        message,
    };

    const newInquiry = await InquiryService.createInquiry( inquiryData );

    sendSuccessResponse( res, {
        message: 'Inquiry submitted successfully',
        data: newInquiry
    } );
};

exports.getInquiries = async ( req, res ) => {
    const { status, search, sort } = req.query;
    let messages;
    if ( search ) {
        messages = await InquiryService.searchInquiries( search );
    } else {
        messages = await InquiryService.getInquiries( { status, sort: sort } );
    }

    sendSuccessResponse( res, {
        message: 'Inquirys retrieved successfully',
        data: messages
    } );
};

exports.getInquiry = async ( req, res ) => {
    const { id } = req.params;

    if ( !id ) {
        throw new ValidationError( 'Inquiry ID is required' );
    }

    const message = await InquiryService.findInquiry( { _id: id } );
    if ( !message ) {
        throw new NotFoundError( 'Inquiry not found' );
    }

    sendSuccessResponse( res, {
        message: 'Inquiry retrieved successfully',
        data: message
    } );
};


exports.replyToInquiry = async ( req, res ) => {
    const { id } = req.params;
    const replyData = req.body;
    if ( !id || !replyData ) {
        throw new ValidationError( 'Inquiry ID and reply content are required' );
    }

    const inquiryData = await InquiryService.findInquiry( { _id: id } );
    if ( !inquiryData ) {
        throw new NotFoundError( 'Inquiry not found' );
    }

    const info = await sendMail(
        inquiryData.email,
        `Reply: ${ inquiryData.subject }`,
        `<p>${ replyData }</p>`
    );

    if ( info.accepted[ 0 ] !== inquiryData.email ) {
        throw new ValidationError( 'Email sending failed' );
    }

    const updatedInquiry = await InquiryService.updateInquiry( { messageId: id, data: { status: INQUIRY_STATUS.RESOLVED } } );

    sendSuccessResponse( res, {
        message: 'Inquiry solved successfully',
        data: updatedInquiry
    } );
};

exports.deleteInquiry = async ( req, res ) => {
    const { id } = req.params;

    if ( !id ) {
        throw new ValidationError( 'Inquiry ID is required' );
    }

    const deletedInquiry = await InquiryService.deleteInquiry( id );
    if ( !deletedInquiry ) {
        throw new NotFoundError( 'Inquiry not found' );
    }

    sendSuccessResponse( res, {
        message: 'Inquiry deleted successfully',
        data: deletedInquiry
    } );
};