import { Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'
import { OrderDocument } from './OrderModel'
import { TransactionDocument } from './TransactionModel'
import { UserDocument } from './UserModel'

export interface ArbitrageTransactionDocument extends IDocument {
    service: String
    buyTransactionId: Schema.Types.ObjectId
    sellTransactionId: Schema.Types.ObjectId
    buyTransaction: TransactionDocument
    sellTransaction: TransactionDocument
    order: OrderDocument
    orderId: String
    profitBtc: Number
    profitPercent: Number
    userId: String
    user: UserDocument
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
        orderId: {
            ref: 'Order',
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
