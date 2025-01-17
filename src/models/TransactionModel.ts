import { Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'
import { BankTransferDocument } from './BankTransferModel'
import { CommentDocument } from './CommentModel'
import { OrderDocument } from './OrderModel'
import { UserDocument } from './UserModel'

export interface TransactionDocument extends IDocument {
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
    bankTransfers: [BankTransferDocument]
    bankTransferIds: [Schema.Types.ObjectId|String]
    order: OrderDocument
    orderId: Schema.Types.ObjectId|String
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
            type: String,
            enum: ['BUY', 'SELL']
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
        // comments: [CommentModel],
        userId: {
			ref: 'User',
			type: Schema.Types.ObjectId,
		},
        orderId: {
            ref: 'Order',
            type: Schema.Types.ObjectId,
        },
        // Bank transfers
		bankTransferIds: [{
			ref: 'BankTransfer',
			type: Schema.Types.ObjectId
		}]
	},
	{ timestamps: true }
)

export default model<TransactionDocument>('Transaction', TransactionSchema)
