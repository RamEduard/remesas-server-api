import { Document, Schema, model } from 'mongoose'

export interface HistoryRateDocument extends Document {
    pair: String
    title: String
    service: String
    date: Date
    avg: Number
    buy: Number
    sell: Number
    spread: Number
    spreadPercent: Number
}

const HistoryRateSchema: Schema = new Schema(
	{
		pair: {
            type: String,
            required: true
        },
		title: {
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
        },
        spread: {
            type: Number,
            required: true
        },
        spreadPercent: {
            type: Number,
            required: true
        },
	},
	{ timestamps: true }
)

export default model<HistoryRateDocument>('HistoryRate', HistoryRateSchema)