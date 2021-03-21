import { Document, Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'
import { UserDocument } from './UserModel'

export interface OrderDocument extends IDocument {
	token: String
	date: Date
	status: StatusType
	fromCurrency: String
	toCurrency: String
	baseRate: Number
	fromAmount: Number
	toAmount: Number
	contactEmail: String
	contactPhone: String
	contactFullName: String
	// User Client
    userClient: UserDocument
	userClientId: Schema.Types.ObjectId|String
	// Seller
	user: UserDocument
	userId: Schema.Types.ObjectId|String
	createdAt: Date
    updatedAt: Date
}

export enum StatusType {
	DRAFT,
	ERROR,
	PENDING,
	WAITING_CONFIRMATION,
	CONFIRMED,
	CANCELED,
	FINISHED
}

const OrderSchema: Schema = new Schema(
	{
		token: {
			type: String,
			required: true
		},
		date: {
            type: Date,
            required: true
		},
		fromCurrency: {
            type: String,
            required: true
		},
		toCurrency: {
            type: String,
            required: true
		},
		baseRate: {
            type: Number,
            required: true
		},
		fromAmount: {
            type: Number,
            required: true
		},
		toAmount: {
            type: Number,
            required: true
		},
		contactEmail: {
            type: String,
            required: true
		},
		status: {
			enum: [
				'DRAFT',
				'ERROR',
				'PENDING',
				'WAITING_CONFIRMATION',
				'CONFIRMED',
				'FINISHED',
				'CANCELED',
			],
			type: String,
			default: 'DRAFT'
		},
		contactPhone: {
			type: String,
			default: 'None'
		},
		contactFullName: {
			type: String,
			required: true
		},
		userClientId: {
			ref: 'User',
			type: Schema.Types.ObjectId
		},
		// Seller
		userId: {
			ref: 'User',
			type: Schema.Types.ObjectId
		},
	},
	{ timestamps: true }
)

export default model<OrderDocument>('Order', OrderSchema)
