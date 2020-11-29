import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import _ from 'lodash'

import { JWT_ALGORITHM, JWT_SECRET } from './index'

// import { User, UserType } from '../models/User';
import UserModel, { UserDocument } from '../models/UserModel'

passport.serializeUser<any, any>((user, done) => {
	done(undefined, user.id)
})

passport.deserializeUser((id, done) => {
	UserModel.findById(id, (err, user) => {
		done(err, user)
	})
})

/**
 * Sign in using Email and Password.
 */
passport.use(
	new LocalStrategy({ usernameField: 'email', session: false }, (email, password, done) => {
		UserModel.findOne({ email: email.toLowerCase() }, (err, user: any) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(undefined, false, { message: `Email ${email} not found.` })
			}
			user.comparePassword(password, (err: Error, isMatch: boolean) => {
				if (err) {
					return done(err)
				}
				if (isMatch) {
					return done(undefined, user)
				}
				return done(undefined, false, { message: 'Invalid email or password.' })
			})
		}).catch((err: Error) => done(err, null))
	})
)

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET,
	algorithms: [JWT_ALGORITHM],
}

/**
 * Sign in using JWT
 */
passport.use(
	new JwtStrategy(jwtOptions, (payload, done) => {
		UserModel.findOne({ _id: payload.sub }, (err, user: UserDocument) => {
			if (!user || user === null) {
				return done(null, false)
			} else {
				return done(null, user)
			}
		}).catch((err: Error) => done(err, null))
	})
)

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		//si hubo un error relacionado con la validez del token (error en su firma, caducado, etc)
		if (info) {
			return next(new Error(info.message))
		}

		//si hubo un error en la consulta a la base de datos
		if (err) {
			return next(err)
		}

		//si el token está firmado correctamente pero no pertenece a un usuario existente
		if (!user) {
			return next(new Error('You are not allowed to access.'))
		}

		//inyectamos los datos de usuario en la request
		req.user = user
		next()
	})(req, res, next)
}
