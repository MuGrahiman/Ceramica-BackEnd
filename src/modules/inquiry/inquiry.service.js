const { default: mongoose } = require( 'mongoose' );
const InquiryModel = require( './inquiry.model' );
const { ValidationError } = require( '../../errors/customErrors' );
const { INQUIRY_STATUS_ARRAY } = require( '../../utilities/constants' );

const verifyMongoId = ( id ) => {
    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        throw new ValidationError( 'Invalid ID format' );
    }
    return id;
};

class InquiryService {
    static async createInquiry ( data ) {
        const newInquiry = new InquiryModel( data );
        await newInquiry.save();
        return newInquiry;
    }

    static async getInquiries ( { status, sort  } = {} ) {
        const query = {};
        const sortedValue = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }
        // Only add status to the query if it is provided
        if ( status ) {
            query.status = status;
        }
        return await InquiryModel.find( query ).sort( sortedValue );
    }

    static async findInquiry ( data ) {
        if ( data._id ) verifyMongoId( data._id );
        return await InquiryModel.findOne( data );
    }

    static async updateInquiry ( { messageId, data } ) {
        verifyMongoId( messageId );
        return await InquiryModel.findByIdAndUpdate(
            messageId,
            data,
            { new: true, runValidators: true }
        );
    }

    static async deleteInquiry ( messageId ) {
        verifyMongoId( messageId );
        return await InquiryModel.findByIdAndDelete( messageId );
    }

    static async getInquiriesByStatus ( { status, sort } ) {
        if ( !INQUIRY_STATUS_ARRAY.includes( status ) ) {
            throw new ValidationError( 'Invalid status value' );
        }
        return this.getInquiries( { status, sort } );
    }

    static async searchInquiries ( searchTerm ) {
        if ( !searchTerm || typeof searchTerm !== 'string' ) {
            return this.getInquiries();
        }

        return await InquiryModel.find( {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { subject: { $regex: searchTerm, $options: 'i' } },
                { message: { $regex: searchTerm, $options: 'i' } }
            ]
        } ).sort( { createdAt: -1 } );
    }
}

module.exports = InquiryService;