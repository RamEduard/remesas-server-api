import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import RedisCache from '../../utils/RedisCache'
import LocalBitcoinsService from '../../services/LocalBitcoins/LocalBitcoinsService';
import DashboardDataSource from '../../dataSources/DashboardDataSource';
import { UserDocument } from '../../models/UserModel';
import RatesDataSource from '../../dataSources/RatesDataSource';

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
        const { currencyCode } = req.params
        const { refresh, payment_method } = req.query

        if (isEmpty(currencyCode)) 
            return res.status(400).json({
                error: {
                    params: ['currencyCode'] 
                },
                message: 'Param currencyCode is invalid.'
            })

        const dashboardDataSource = new RatesDataSource(
            req.app.get('service.localbitcoins'),
            new RedisCache(600)
        )

        const response = await dashboardDataSource.ratesByCurrency(
            currencyCode,
            { paymentMethod: <string>payment_method!},
            Boolean(refresh)
        )

        res.json({
            data: response
        })
    }

    /**
     * Dashboard by user logged in
     * @param req 
     * @param res 
     */
    async dashboardUser(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) {
        const dashboardDataSource = new DashboardDataSource(
            req.app.get('service.localbitcoins'),
            new RedisCache(600)
        )

        const response = await dashboardDataSource.dashboardByUser({}, <UserDocument>req.user!)

        res.json({
            data: response
        })
    }
}