import { createServer } from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'

import { PORT, MONGO_URL } from './config'
import connectMongo from './utils/MongooseConnection'
import RedisCache from './utils/RedisCache'
import graphql from './graphql'
import { mainRouter, rateRouter, userRouter } from './routes'
import { localBitcoinsService } from './services'

const app = express()
const server = createServer(app)

// app.use(express.json())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// Services
app.set('service.localbitcoins', localBitcoinsService)

// Redis
const cache1h = new RedisCache(3600)

// MongoDB
connectMongo({ db: MONGO_URL })


// Routes
app.use(mainRouter)
app.use('/rates', rateRouter)
app.use('/users', userRouter)

// TODO: CRON JOBS

graphql(app, cache1h).then(() => {
    console.log(`🚀 Apollo Server is listening on http://localhost:${PORT}/graphql`)

    server.listen(PORT, () => {
        console.log(`🚀 Server is listening on port ${PORT}`)
    })
})
