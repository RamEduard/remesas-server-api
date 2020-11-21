import { Tedis } from "tedis"

import { REDIS_HOST, REDIS_PORT } from '../config'

export default class RedisCache extends Tedis {

    /**
     * Constructor
     * 
     * @param {number} ttlSeconds TTL Seconds (default 1h or 360 seconds)
     */
    constructor(private ttlSeconds:number = 360) {
        super({
            port: <number>REDIS_PORT || 6379,
            host: REDIS_HOST || 'localhost'
        })
    }

    public async add(key:string, value:any) {
        await this.setex(key, this.ttlSeconds, JSON.stringify(value))
        return value
    }

    public async getValue(key:string): Promise<any> {
        try {
            const value = await this.get(key)

            return JSON.parse(<string>value || '{}')
        } catch(e) {
            return null
        }
    }
}