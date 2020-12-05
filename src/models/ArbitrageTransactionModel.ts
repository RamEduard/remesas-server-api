import { Document, Schema, model } from 'mongoose'

import { TransactionDocument } from './TransactionModel'

export interface ArbitrageTransactionDocument extends Document {
    service: String
    buyTransactionId: Schema.Types.ObjectId
    sellTransactionId: Schema.Types.ObjectId
    buyTransaction: TransactionDocument
    sellTransaction: TransactionDocument
    profitBtc: Number
    profitPercent: Number
}

const ArbitrageTransactionSchema: Schema = new Schema(
	{
		service: {
            type: String,
            required: true
        },
        buyTransactionId: {
			ref: 'Transaction',
			type: Schema.Types.ObjectId,
			required: true,
        },
        sellTransactionId: {
			ref: 'Transaction',
			type: Schema.Types.ObjectId,
			required: true,
		},
        profitBtc: {
            type: Number,
            required: true
        },
        profitPercent: {
            type: Number,
            required: true
        },
        userId: {
			ref: 'User',
			type: Schema.Types.ObjectId,
			required: true,
		}
	},
	{ timestamps: true }
)

export default model<ArbitrageTransactionDocument>('ArbitrageTransaction', ArbitrageTransactionSchema)
