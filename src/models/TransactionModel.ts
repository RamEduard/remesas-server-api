import { Document, Schema, model } from 'mongoose'

import CommentModel, { CommentDocument } from './CommentModel'
import { UserDocument } from './UserModel'

export interface TransactionDocument extends Document {
    type: TransactionType
    rate: Number
    currency: String
    currencyLabel: String
    amountBtc: Number
    amountCurrency: Number
    paymentMethod: String
    paymentMethodDescription: String
    images: [String]
    comments: [CommentDocument]
    user: UserDocument
    userId: Schema.Types.ObjectId|String
    createdAt: Date
    updatedAt: Date
}

enum TransactionType {
    BUY,
    SELL
}

const TransactionSchema: Schema = new Schema(
	{
		type: {
            enum: ['BUY', 'SELL'],
            required: true
        },
		rate: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        currencyLabel: String,
        amountBtc: {
            type: Number,
            required: true
        },
        amountCurrency: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentMethodDescription: String,
        images: [String],
        comments: {
            type: [CommentModel],
            default: []
        },
        userId: {
			ref: 'User',
			type: Schema.Types.ObjectId,
		}
	},
	{ timestamps: true }
)

export default model<TransactionDocument>('Transaction', TransactionSchema)
