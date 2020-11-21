import dotenv from 'dotenv'
import {resolve} from 'path'

dotenv.config({ path: resolve(__dirname, '../../.env')})

export const {
    // LocalBitcoins vars
    LOCAL_BITCOINS_API_KEY = '',
    LOCAL_BITCOINS_API_SECRET = '',
    // Environment
    NODE_ENV,
    PORT = 4000,
    // MongoDB
    MONGO_URL = 'mongodb://localhost:27017/remesas',
    // Redis
    REDIS_HOST = 'localhost',
    REDIS_PORT = 6379
} = process.env
