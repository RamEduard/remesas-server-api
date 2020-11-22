import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'

import { PORT, MONGO_URL } from './config'
import { mainRouter, rateRouter, userRouter } from './routes'
import { localBitcoinsService } from './services'

const app = express()

// app.use(express.json())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// Services
app.set('service.localbitcoins', localBitcoinsService)

// Routes
app.use(mainRouter)
app.use('/rates', rateRouter)
app.use('/users', userRouter)

app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`)
})
