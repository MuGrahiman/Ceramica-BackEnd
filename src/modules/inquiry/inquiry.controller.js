const { NotFoundError, ValidationError } = require( '../../errors/customErrors' );
const { sendSuccessResponse } = require( '../../utilities/responses' );
const InquiryService = require( './inquiry.service' );
const { INQUIRY_STATUS } = require( '../../utilities/constants' );

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
    console.log( "🚀 ~ exports.getInquiries= ~ sort:", sort )
    let messages;
    if ( search ) {
        messages = await InquiryService.searchInquiries( search );
    } else {
        messages = await InquiryService.getInquiries( { status, sort: sort } );
    }

    sendSuccessResponse( res, {
        message: 'Messages retrieved successfully',
        data: messages
    } );
};

exports.getInquiry = async ( req, res ) => {
    const { id } = req.params;

    if ( !id ) {
        throw new ValidationError( 'Message ID is required' );
    }

    const message = await InquiryService.findInquiry( { _id: id } );
    if ( !message ) {
        throw new NotFoundError( 'Message not found' );
    }

    sendSuccessResponse( res, {
        message: 'Message retrieved successfully',
        data: message
    } );
};

exports.updateInquiry = async ( req, res ) => {
    const { id } = req.params;
    const data = req.body;

    if ( !id || Object.keys( data ).length === 0 ) {
        throw new ValidationError( 'Message ID and update data are required' );
    }

    // Prevent certain fields from being updated
    const allowedUpdates = [ 'status', 'adminNotes' ];
    const updates = Object.keys( data ).filter( key => allowedUpdates.includes( key ) );

    if ( updates.length === 0 ) {
        throw new ValidationError( 'No valid fields to update' );
    }

    if ( data.status && !Object.values( INQUIRY_STATUS ).includes( data.status ) ) {
        throw new ValidationError( 'Invalid status value' );
    }

    const updateObject = {};
    updates.forEach( update => updateObject[ update ] = data[ update ] );

    const updatedMessage = await InquiryService.updateInquiry( {
        messageId: id,
        data: updateObject
    } );

    if ( !updatedMessage ) {
        throw new NotFoundError( 'Message not found' );
    }

    sendSuccessResponse( res, {
        message: 'Message updated successfully',
        data: updatedMessage
    } );
};

exports.deleteInquiry = async ( req, res ) => {
    const { id } = req.params;

    if ( !id ) {
        throw new ValidationError( 'Message ID is required' );
    }

    const deletedMessage = await InquiryService.deleteInquiry( id );
    if ( !deletedMessage ) {
        throw new NotFoundError( 'Message not found' );
    }

    sendSuccessResponse( res, {
        message: 'Message deleted successfully',
        data: deletedMessage
    } );
};