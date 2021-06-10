import { DataSource } from 'apollo-datasource'
import { ApolloError } from 'apollo-server'
import { isEmpty } from 'lodash'
import moment from 'moment'

import LocalBitcoinsService from '../services/LocalBitcoins/LocalBitcoinsService'
import { LocalBitcoinsListAd, LocalBitcoinsAdResponse } from '../services/LocalBitcoins/types'
import RedisCache from '../utils/RedisCache'
import CalculatorInstance from '../utils/Calculator'

/**
 * Filter ads
 * 
 * @param ad   Ad list data
 * @param mObj Moment object
 * @returns 
 */
function filterAds(ad: LocalBitcoinsListAd, mObj = moment()) {
    return ad.data.visible === true && mObj.diff(moment(ad.data.profile.last_online), 'hours') < 2
}

export default class RatesDataSource extends DataSource {
    
    constructor(
        private localBitcoinsService: LocalBitcoinsService,
        private _cache10min: RedisCache
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
     * @param {LocalBitcoinsAdFilter} filters Filter data
     * @param {boolean} refresh      Refresh cache
     */
    async ratesByCurrency(currencyCode: string, filters: LocalBitcoinsAdFilter, refresh = true) {
        // Invalid currencyCode
        if (isEmpty(currencyCode)) return new ApolloError(`Param currencyCode is invalid.`, '400')

        // Caché por 1h
        const existsCache = await this._cache10min.exists(`RatesDataSource.ratesByCurrency.${currencyCode}`)

        if (refresh || existsCache === 0) {
            const [buy, sell, avg] = await Promise.all([
                this.localBitcoinsBuy(currencyCode, filters),
                this.localBitcoinsSell(currencyCode, filters),
                this.localBitcoinsService.getBtcAvgAllCurrencies()
            ])

            const today = moment()

            // Buscar el más bajo
            const tempBuyPrices = buy?.ad_list
                .filter((ad: LocalBitcoinsListAd) => filterAds(ad, today))
                .map((a: LocalBitcoinsListAd) => Number(a.data.temp_price))
                .sort((a: number, b: number) => a - b) || []
            // const tempBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price)).filter(a => a > 1) || []
            const sumBuyPrices = tempBuyPrices?.reduce((a: number, b: number) => a + b, 0) || []
            // @ts-ignore
            const avgBuy = sumBuyPrices / tempBuyPrices?.length

            // Precio en USD
            const tempUsdBuyPrices = buy?.ad_list
                .map((a: LocalBitcoinsListAd) => Number(a.data.temp_price_usd))
                .sort((a: number, b: number) => a - b) || []
            // const tempUsdBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price_usd)).filter(a => a > 1) || []
            const sumUsdBuyPrices = tempUsdBuyPrices?.reduce((a: number, b: number) => a + b, 0) || []
            // @ts-ignore
            const avgUsdBuy = sumUsdBuyPrices / tempUsdBuyPrices?.length

            // Buscar el más alto
            const tempSellPrices = sell?.ad_list
                .filter((ad: LocalBitcoinsListAd) => filterAds(ad, today))
                .map((a: LocalBitcoinsListAd) => Number(a.data.temp_price))
                .sort((a: number, b: number) => a - b) || []
            // const tempSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price)).filter(a => a > 1) || []
            const sumSellPrices = tempSellPrices?.reduce((a: number, b: number) => a + b, 0) || []
            // @ts-ignore
            const avgSell = sumSellPrices / tempSellPrices?.length

            // Precio en USD
            const tempUsdSellPrices = sell?.ad_list
                .map((a: LocalBitcoinsListAd) => Number(a.data.temp_price_usd))
                .sort((a: number, b: number) => a - b) || []
            // const tempUsdSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price_usd)).filter(a => a > 1) || []
            const sumUsdSellPrices = tempUsdSellPrices?.reduce((a: number, b: number) => a + b, 0) || []
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
                    first: buy?.ad_list.filter((ad: LocalBitcoinsListAd) => filterAds(ad, today))[0].data.temp_price,
                    min: tempBuyPrices[0],
                    max: tempBuyPrices[tempBuyPrices.length - 1],
                    avg_usd: avgUsdBuy,
                    min_usd: tempUsdBuyPrices[0],
                    max_usd: tempUsdBuyPrices[tempUsdBuyPrices.length - 1],
                },
                sell: {
                    avg: avgSell,
                    first: sell?.ad_list.filter((ad: LocalBitcoinsListAd) => filterAds(ad, today))[0].data.temp_price,
                    min: tempSellPrices[0],
                    max: tempSellPrices[tempSellPrices.length - 1],
                    avg_usd: avgUsdSell,
                    min_usd: tempUsdSellPrices[0],
                    max_usd: tempUsdSellPrices[tempUsdSellPrices.length - 1],
                },
                spread: {
                    avg: 1 - (avgSell / avgBuy),
                    first: 0,
                    min: 1 - (tempSellPrices[0] / tempBuyPrices[0]),
                    max: 1 - (tempSellPrices[tempSellPrices.length - 1] / tempBuyPrices[tempBuyPrices.length - 1]),
                    avg_usd: 1 - (avgUsdSell / avgUsdBuy),
                    min_usd: 1 - (tempUsdSellPrices[0] / tempUsdBuyPrices[0]),
                    max_usd: 1 - (tempUsdSellPrices[tempUsdSellPrices.length - 1] / tempUsdBuyPrices[tempUsdBuyPrices.length - 1]),
                }
            }

            response.spread.first = CalculatorInstance.spread(
                Number(response.buy.first),
                Number(response.sell.first),
                Number(avg[currencyCode].rates.last)
            )

            // add cache
            return await this._cache10min.add(`RatesDataSource.ratesByCurrency.${currencyCode}`, response)
        }

        return await this._cache10min.getValue(`RatesDataSource.ratesByCurrency.${currencyCode}`)
    }

    /**
     * Buy local bitcoins by currency
     * @param {string} currencyCode  Currency code 3 letters uppercase
     * @param {LocalBitcoinsAdFilter} filters Filter data
     * @param {boolean} cache        Refresh cache
     */
    async localBitcoinsBuy(currencyCode: string, filters: LocalBitcoinsAdFilter, cache = false): Promise<ApolloError|LocalBitcoinsAdResponse|null> {
        // Invalid currencyCode
        if (isEmpty(currencyCode)) return new ApolloError(`Param currencyCode is invalid.`, '400')

        const buyResult = await this.localBitcoinsService.getBuyBitcoinsOnline(currencyCode, filters?.paymentMethod)

        if (buyResult === null) return {
            ad_count: 0,
            ad_list: []
        }

        if (filters?.online_provider) {
            buyResult.ad_list = buyResult.ad_list.filter(ad => ad.data.online_provider === filters?.online_provider)
            buyResult.ad_count = buyResult.ad_list.length
        }

        if (filters?.bank_name) {
            buyResult.ad_list = buyResult.ad_list.filter(ad => ad.data.bank_name.includes(filters?.bank_name))
            buyResult.ad_count = buyResult.ad_list.length
        }

        return buyResult
    }

    /**
     * Sell local bitcoins by currency
     * @param {string} currencyCode  Currency code 3 letters uppercase
     * @param {LocalBitcoinsAdFilter} filters Filter data
     * @param {boolean} cache        Refresh cache
     */
    async localBitcoinsSell(currencyCode: string, filters: LocalBitcoinsAdFilter, cache = false): Promise<ApolloError|LocalBitcoinsAdResponse|null> {
        // Invalid currencyCode
        if (isEmpty(currencyCode)) return new ApolloError(`Param currencyCode is invalid.`, '400')

        const sellResult = await this.localBitcoinsService.getSellBitcoinsOnline(currencyCode, filters?.paymentMethod)

        if (sellResult === null) return {
            ad_count: 0,
            ad_list: []
        }

        if (filters?.online_provider) {
            sellResult.ad_list = sellResult.ad_list.filter(ad => ad.data.online_provider === filters?.online_provider)
            sellResult.ad_count = sellResult.ad_list.length
        }

        if (filters?.bank_name) {
            sellResult.ad_list = sellResult.ad_list.filter(ad => ad.data.bank_name.includes(filters?.bank_name))
            sellResult.ad_count = sellResult.ad_list.length
        }

        return sellResult
    }
}

export interface RatesFilters {
    paymentMethod: string
}

export interface LocalBitcoinsAdFilter {
    paymentMethod: string
    bank_name: string
    online_provider: string
}