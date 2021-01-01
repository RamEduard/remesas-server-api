import { isEmpty } from "lodash";
import RedisCache from "../utils/RedisCache";

var GLOBAL_CACHE = {
    '10m': null,
    '1h': null
}

export default class CacheFactory {

    public static create(name: string, ttlSeconds: number): RedisCache {
        // @ts-ignore
        let existCache = !isEmpty(GLOBAL_CACHE[name])

        // @ts-ignore
        if (existCache && GLOBAL_CACHE[name] !== null) return <RedisCache>GLOBAL_CACHE[name]

        // @ts-ignore
        GLOBAL_CACHE[name] = new RedisCache(ttlSeconds)
        
        // @ts-ignore
        return GLOBAL_CACHE[name]
    }

}