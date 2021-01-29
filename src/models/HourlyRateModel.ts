import { Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'

export interface HourlyRateDocument extends IDocument {
    pair: String
    service: String
    date: Date
    avg: number
    buy: number
    sell: number
}

const HistoryRateSchema: Schema = new Schema(
	{
		pair: {
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
        avg: {
            type: Number,
            required: true
        },
        buy: {
            type: Number,
            required: true
        },
        sell: {
            type: Number,
            required: true
        }
	},
	{ timestamps: true }
)

export default model<HourlyRateDocument>('HourlyRate', HistoryRateSchema)
