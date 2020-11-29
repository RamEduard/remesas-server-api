import { DataSource } from 'apollo-datasource'
import { ApolloError } from 'apollo-server'
import { isEmpty } from 'lodash'

import LocalBitcoinsService from '../services/LocalBitcoins/LocalBitcoinsService'
import RedisCache from '../utils/RedisCache'

export default class RatesDataSource extends DataSource {
    
    constructor(
        private localBitcoinsService: LocalBitcoinsService,
        private _cache1h: RedisCache
    ) {
        super()
    }

    /**
     * BTC Average all currencies
     * @param {object}  args Resolver args
     */
    async btcAvg({}) {
        const btcAvg = await this.localBitcoinsService.getBtcAvgAllCurrencies()

        const list = Object.keys(btcAvg).map(key => {
            return {
                ...btcAvg[key],
                currency: key
            }
        })

        return list
    }

    /**
     * Rates by currency
     * @param {string} currencyCode  Currency code 3 letters uppercase
     * @param {RatesFilters} filters Filter data
     * @param {boolean} refresh      Refresh cache
     */
    async ratesByCurrency(currencyCode: string, filters: RatesFilters, refresh = false) {
        // Invalid currencyCode
        if (isEmpty(currencyCode)) return new ApolloError(`Param currencyCode is invalid.`, '400')

        // Caché por 1h
        const existsCache = await this._cache1h.exists(`RatesDataSource.ratesByCurrency.${currencyCode}`)

        if (refresh || existsCache === 0) {
            const [buy, sell, avg] = await Promise.all([
                this.localBitcoinsService.getBuyBitcoinsOnline(currencyCode, filters?.paymentMethod),
                this.localBitcoinsService.getSellBitcoinsOnline(currencyCode, filters?.paymentMethod),
                this.localBitcoinsService.getBtcAvgAllCurrencies()
            ])

            // Buscar el más bajo
            const tempBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price)).filter(a => a > 1).sort((a, b) => a - b) || []
            // const tempBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price)).filter(a => a > 1) || []
            const sumBuyPrices = tempBuyPrices?.reduce((a, b) => a + b, 0) || []
            // @ts-ignore
            const avgBuy = sumBuyPrices / tempBuyPrices?.length

            // Precio en USD
            const tempUsdBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price_usd)).filter(a => a > 1).sort((a, b) => a - b) || []
            // const tempUsdBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price_usd)).filter(a => a > 1) || []
            const sumUsdBuyPrices = tempUsdBuyPrices?.reduce((a, b) => a + b, 0) || []
            // @ts-ignore
            const avgUsdBuy = sumUsdBuyPrices / tempUsdBuyPrices?.length

            // Buscar el más alto
            const tempSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price)).filter(a => a > 1).sort((a, b) => a - b) || []
            // const tempSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price)).filter(a => a > 1) || []
            const sumSellPrices = tempSellPrices?.reduce((a, b) => a + b, 0) || []
            // @ts-ignore
            const avgSell = sumSellPrices / tempSellPrices?.length

            // Precio en USD
            const tempUsdSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price_usd)).filter(a => a > 1).sort((a, b) => a - b) || []
            // const tempUsdSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price_usd)).filter(a => a > 1) || []
            const sumUsdSellPrices = tempUsdSellPrices?.reduce((a, b) => a + b, 0) || []
            // @ts-ignore
            const avgUsdSell = sumUsdSellPrices / tempUsdSellPrices?.length
    
            // Avg, Buy, Sell, Spread
            // Max, Min, Count ads
            const response = {
                avg: {
                    currency: currencyCode,
                    ...avg[currencyCode]
                },
                buy: {
                    avg: avgBuy,
                    min: tempBuyPrices[0],
                    max: tempBuyPrices[tempBuyPrices.length - 1],
                    avg_usd: avgUsdBuy,
                    min_usd: tempUsdBuyPrices[0],
                    max_usd: tempUsdBuyPrices[tempUsdBuyPrices.length - 1],
                },
                sell: {
                    avg: avgSell,
                    min: tempSellPrices[0],
                    max: tempSellPrices[tempSellPrices.length - 1],
                    avg_usd: avgUsdSell,
                    min_usd: tempUsdSellPrices[0],
                    max_usd: tempUsdSellPrices[tempUsdSellPrices.length - 1],
                },
                spread: {
                    avg: 1 - (avgSell / avgBuy),
                    min: 1 - (tempSellPrices[0] / tempBuyPrices[0]),
                    max: 1 - (tempSellPrices[tempSellPrices.length - 1] / tempBuyPrices[tempBuyPrices.length - 1]),
                    avg_usd: 1 - (avgUsdSell / avgUsdBuy),
                    min_usd: 1 - (tempUsdSellPrices[0] / tempUsdBuyPrices[0]),
                    max_usd: 1 - (tempUsdSellPrices[tempUsdSellPrices.length - 1] / tempUsdBuyPrices[tempUsdBuyPrices.length - 1]),
                }
            }

            // add cache
            return await this._cache1h.add(`RatesDataSource.ratesByCurrency.${currencyCode}`, response)
        }

        return await this._cache1h.getValue(`RatesDataSource.ratesByCurrency.${currencyCode}`)
    }
}

export interface RatesFilters {
    paymentMethod: string
}
