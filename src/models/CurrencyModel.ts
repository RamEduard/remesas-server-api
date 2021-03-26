import { Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'

export interface CurrencyDocument extends IDocument {
	code: String
    symbol: String
    description: String
}

const CurrencySchema: Schema = new Schema(
	{
		code: {
			type: String,
			required: true,
		},
        symbol: {
			type: String,
			required: true,
		},
        description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

export default model<CurrencyDocument>('Currency', CurrencySchema)
