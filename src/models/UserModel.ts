import { model, Model, Schema, Document } from 'mongoose'

export interface User extends Document {
    email: string
    firstName: string
    lastName: string
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
})

// Virtuals
UserSchema.virtual("fullName").get(function() {
    // @ts-ignore
    return this.firstName + this.lastName
})

// Middlewares
UserSchema.pre<User>("save", function(next) {
    if (this.isModified("password")) {
        // @ts-ignore
        // this.password = JSON.stringify(this.password).to
    }
})

export default model<User>('User', UserSchema)