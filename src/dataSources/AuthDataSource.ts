import { DataSource } from 'apollo-datasource'
import { ApolloError } from 'apollo-server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { BCRYPT_ROUNDS, JWT_LIFETIME, JWT_ALGORITHM, JWT_SECRET } from '../config'
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

            if (userExists) return new ApolloError('Username exists.', '200')
            
			const userDoc = new UserModel({ ...user })

			const userSaved = await userDoc.save()

			// JWT
			const payload = {
				sub: userSaved._id,
				exp: Date.now() + parseInt(<string>JWT_LIFETIME),
				email: user.email.toLowerCase(),
			}

			return {
				// @ts-ignore
				token: jwt.sign(JSON.stringify(payload), JWT_SECRET, { algorithm: JWT_ALGORITHM }),
				expirationDate: new Date(payload.exp).toISOString(),
			}
		} catch (e) {
			console.log(e)
		}
	}
}

interface InputUser {
	firstName: string
	lastName: string
	email: string
	password: string
}
