import { Document, Schema, model } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'
import { UserDocument } from './UserModel'

export interface CommentDocument extends IDocument {
	body: String
    user: UserDocument,
    userId: Schema.Types.ObjectId|String
}

const CommentSchema: Schema = new Schema(
	{
		body: String,
		userId: {
			ref: 'User',
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
)

export default model<CommentDocument>('Comment', CommentSchema)
