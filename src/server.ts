import { createServer } from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'

import { PORT, MONGO_URL } from './config'
import connectMongo from './utils/MongooseConnection'
import RedisCache from './utils/RedisCache'
import graphql from './graphql'
import { mainRouter, rateRouter, userRouter } from './routes'
import { localBitcoinsService } from './services'
import { isAuthenticated } from './config/passport'

const app = express()
const server = createServer(app)

// app.use(express.json())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())

// Services
app.set('service.localbitcoins', localBitcoinsService)

// Redis
const cache1h = new RedisCache(3600)

// MongoDB
connectMongo({ db: MONGO_URL })

// Routes
app.use(mainRouter)
app.use('/rates', isAuthenticated, rateRouter)
app.use('/users', userRouter)

// Authorization middleware
app.use(async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {    
        // inyectamos los datos de usuario en la request
        req.user = user
        next()
    })(req, res, next)
})

// Error handlers
// @ts-ignore
app.use((err, req, res, next) => {
    if ('No auth token' === err.message) {
        return res.status(401).json({
            data: null,
            error: {
                code: 401,
                message: 'Unauthorized'
            },
            message: err.message
        })
    }
    if (err.statusCode) {
        return res.status(err.statusCode || 500).json({
            data: null,
            error: err,
            message: err.message
        })
    }
    next()
})

// TODO: CRON JOBS

graphql(app, cache1h).then(() => {
    console.log(`🚀 Apollo Server is listening on http://localhost:${PORT}/graphql`)

    server.listen(PORT, () => {
        console.log(`🚀 Server is listening on port ${PORT}`)
    })
})
