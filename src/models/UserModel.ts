import bcrypt from 'bcrypt'
import { Error, model, Model, Schema, Document } from 'mongoose'

import { BCRYPT_ROUNDS } from '../config'

export interface UserDocument extends Document {
	email: string
	firstName: string
	lastName: string
	password: string
	passwordResetToken: string
	passwordResetExpires: Date

	tokens: AuthToken[]

	profile: {
		name: string
		gender: string
		location: string
		website: string
		picture: string
	}

    comparePassword: comparePasswordFunction
    comparePasswordSync: comparePasswordSyncFunction
}

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void
type comparePasswordSyncFunction = (candidatePassword: string) => boolean

export interface AuthToken {
	accessToken: string
	kind: string
}

const UserSchema: Schema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: String,
		passwordResetToken: String,
		passwordResetExpires: Date,

		tokens: Array,

		profile: {
			name: String,
			gender: String,
			location: String,
			website: String,
			picture: String,
		},
	},
	{ timestamps: true }
)

// Virtuals
UserSchema.virtual('fullName').get(function () {
	// @ts-ignore
	return this.firstName + this.lastName
})

/**
 * Password hash middleware.
 */
UserSchema.pre<UserDocument>('save', function (next) {
	const user = this as UserDocument
	if (!user.isModified('password')) {
		return next()
    }
    const salt = bcrypt.genSaltSync(parseInt(<string>BCRYPT_ROUNDS))
    const hashPassword = bcrypt.hashSync(user.password, salt)
    user.password = hashPassword
    next()
})

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
	// @ts-ignore
	bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
		cb(err, isMatch)
	})
}

const comparePasswordSync: comparePasswordSyncFunction = function (candidatePassword: string) {
    // @ts-ignore
    const user: UserDocument = this as UserDocument
    return bcrypt.compareSync(candidatePassword, user.password)
}

UserSchema.methods.comparePassword = comparePassword
UserSchema.methods.comparePasswordSync = comparePasswordSync

export default model<UserDocument>('User', UserSchema)
