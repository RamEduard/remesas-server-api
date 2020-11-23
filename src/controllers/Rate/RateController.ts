import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import RedisCache from '../../utils/RedisCache'
import LocalBitcoinsService from '../../services/LocalBitcoins/LocalBitcoinsService';

export class RateController {
    
    private _cache1h: RedisCache

    constructor() {
        this._cache1h = new RedisCache(3600)
    }

    public async index(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response):Promise<void> {

        const localBitcoinsService:LocalBitcoinsService = req.app.get('service.localbitcoins')

        const [countries, currencies, btcAvg] = await Promise.all([
            localBitcoinsService.getCountries(),
            localBitcoinsService.getCurrencies(),
            localBitcoinsService.getBtcAvgAllCurrencies()
        ])

        // const ads = await localBitcoinsService.getAds()

        // const tickerAllCurrencies = await localBitcoinsService.getTickerAllCurrencies()

        res.json({
            data: {
                // ads,
                countries,
                currencies: currencies.currencies,
                btcAvg
                // tickerAllCurrencies
            },
            message: 'GET /rates request received'
        });
    }

    /**
     * btcAvg
     * 
     * @param req Request
     * @param res Response
     */
    public async btcAvg(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        const localBitcoinsService:LocalBitcoinsService = req.app.get('service.localbitcoins')

        const btcAvg = await localBitcoinsService.getBtcAvgAllCurrencies()

        res.json({
            data: btcAvg
        })
    }

    /**
     * buyByCurrency
     */
    public async buyByCurrency(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        const localBitcoinsService:LocalBitcoinsService = req.app.get('service.localbitcoins')

        const { currencyCode } = req.params

        if (isEmpty(currencyCode)) 
            return res.status(400).json({
                error: {
                    params: ['currencyCode'] 
                },
                message: 'Param currencyCode is invalid.'
            })

        const buyBitcoinsOnline = await localBitcoinsService.getBuyBitcoinsOnline(currencyCode)

        return res.json({
            data: { buyBitcoinsOnline }
        })
    }

    /**
     * sellByCurrency
     */
    public async sellByCurrency(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        const localBitcoinsService:LocalBitcoinsService = req.app.get('service.localbitcoins')

        const { currencyCode } = req.params

        if (isEmpty(currencyCode)) 
            return res.status(400).json({
                error: {
                    params: ['currencyCode'] 
                },
                message: 'Param currencyCode is invalid.'
            })

        const sellBitcoinsOnline = await localBitcoinsService.getSellBitcoinsOnline(currencyCode)

        return res.json({
            data: { sellBitcoinsOnline }
        })
    }

    /**
     * byCurrencyCode
     * 
     * @param req 
     * @param res 
     */
    public async byCurrencyCode(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        const localBitcoinsService:LocalBitcoinsService = req.app.get('service.localbitcoins')

        const { currencyCode } = req.params
        const { refresh } = req.query

        if (isEmpty(currencyCode)) 
            return res.status(400).json({
                error: {
                    params: ['currencyCode'] 
                },
                message: 'Param currencyCode is invalid.'
            })

        // Caché por 1h
        const existsCache = await this._cache1h.exists(`RateController.byCurrencyCode.${currencyCode}`)

        let response

        if (refresh || existsCache === 0) {
            const [buy, sell, avg] = await Promise.all([
                localBitcoinsService.getBuyBitcoinsOnline(currencyCode),
                localBitcoinsService.getSellBitcoinsOnline(currencyCode),
                localBitcoinsService.getBtcAvgAllCurrencies()
            ])

            // Buscar el más bajo
            const tempBuyPrices = buy?.ad_list.map(a => Number(a.data.temp_price)).sort((a, b) => a - b) || []
            const sumBuyPrices = tempBuyPrices?.reduce((a, b) => a + b, 0) || []
            // @ts-ignore
            const avgBuy = sumBuyPrices / tempBuyPrices?.length

            // Buscar el más alto
            const tempSellPrices = sell?.ad_list.map(a => Number(a.data.temp_price)).sort((a, b) => b - a) || []
            const sumSellPrices = tempSellPrices?.reduce((a, b) => a + b, 0) || []
            // @ts-ignore
            const avgSell = sumSellPrices / tempSellPrices?.length
    
            // Avg, Buy, Sell, Spread
            // Max, Min, Count ads
            response = {
                data: {
                    avg: avg[currencyCode],
                    buy: {
                        avg: avgBuy,
                        min: tempBuyPrices[0],
                        max: tempBuyPrices[tempBuyPrices.length - 1]
                    },
                    sell: {
                        avg: avgSell,
                        min: tempSellPrices[0],
                        max: tempSellPrices[tempSellPrices.length - 1]
                    },
                    spread: {
                        avg: 1 - (avgSell / avgBuy),
                        min: 1 - (tempSellPrices[0] / tempBuyPrices[0]),
                        max: 1 - (tempSellPrices[tempSellPrices.length - 1] / tempBuyPrices[tempBuyPrices.length - 1])
                    }
                }
            }

			// add cache
            await this._cache1h.add(`RateController.byCurrencyCode.${currencyCode}`, response)
            
            return res.json(response)
        }

        response = await this._cache1h.getValue(`RateController.byCurrencyCode.${currencyCode}`)

        res.json(response)
    }

}