import { Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'

export interface HourlyBtcAvgDocument extends IDocument {
    currency: String
    service: String
    date: Date
    avg6h: Number
    avg12h: Number
    avg24h: Number
    last: Number
    volumeBtc: Number
}

const HistoryRateSchema: Schema = new Schema(
	{
		currency: {
            type: String,
            required: true
        },
        service: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        avg6h: {
            type: Number,
            required: true
        },
        avg12h: {
            type: Number,
            required: true
        },
        avg24h: {
            type: Number,
            required: true
        },
        last: {
            type: Number,
            required: true
        },
        volumeBtc: {
            type: Number,
            required: true
        },
	},
	{ timestamps: true }
)

export default model<HourlyBtcAvgDocument>('HourlyBtcAvg', HistoryRateSchema)
