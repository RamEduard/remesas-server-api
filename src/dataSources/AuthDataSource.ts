import { DataSource } from 'apollo-datasource'
import { ApolloError } from 'apollo-server'
import jwt from 'jsonwebtoken'

import { JWT_LIFETIME, JWT_ALGORITHM, JWT_SECRET } from '../config'
import UserModel from '../models/UserModel'

export default class AuthDataSource extends DataSource {
	/**
	 * Auth login
	 * @param {string} email    Email
	 * @param {string} password Password
	 */
	async signin(email: string, password: string) {
		if (!email || !password) return new ApolloError('Email and Password are required', '401')

		const user = await UserModel.findOne({ email: email.toLowerCase() })

		if (!user) return new ApolloError(`Email ${email} not found.`, '401')

		if (!user.verified) return new ApolloError(`User hasn't been verified yet.`, '403')

		if (!user.comparePasswordSync(password)) return new ApolloError('Username or password invalid.')

		// JWT
		const payload = {
			sub: user._id,
			exp: Date.now() + parseInt(<string>JWT_LIFETIME),
			email: user.email,
		}

		return {
			// @ts-ignore
			token: jwt.sign(JSON.stringify(payload), JWT_SECRET, { algorithm: JWT_ALGORITHM }),
			expirationDate: new Date(payload.exp).toISOString(),
		}
	}

	/**
	 * Auth register
	 * @param user
	 */
	async signup(user: InputUser) {
		try {
			const userExists = await UserModel.findOne({ email: user.email.toLowerCase() })

            if (userExists) return new ApolloError('Email exists.', '200')
            
			const userDoc = new UserModel({ ...user })

			await userDoc.save()

			return {
				saved: true,
				message: 'User should be verified by administrator before logged in.'
			}
		} catch (e) {
			console.log(e)
			return {
				saved: false,
				message: e.message
			}
		}
	}
}

interface InputUser {
	firstName: string
	lastName: string
	email: string
	password: string
}
