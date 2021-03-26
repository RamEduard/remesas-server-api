import { Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'
import { TransactionDocument } from './TransactionModel'
import { UserDocument } from './UserModel'

export interface BankTransferDocument extends IDocument {
	amount: Number
    bankDescription: String
    currency: String
    date: Date
    imageUrl: String
    transaction: TransactionDocument,
    transactionId: Schema.Types.ObjectId|String
    user: UserDocument,
    userId: Schema.Types.ObjectId|String
    createdAt: Date
    updatedAt: Date
}

const BankTransferSchema: Schema = new Schema(
	{
        amount: {
            type: Number,
            required: true
        },
        bankDescription: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true,
        },
        imageUrl: String,
		transactionId: {
            ref: 'Transaction',
			type: Schema.Types.ObjectId,
			required: true,
        },
		userId: {
			ref: 'User',
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
)

export default model<BankTransferDocument>('BankTransfer', BankTransferSchema)
