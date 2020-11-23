import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import LocalBitcoinsService from '../../services/LocalBitcoins/LocalBitcoinsService';

export class RateController {

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

    public localBitcoinsSignature(req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response):void {
        const localBitcoinsService:LocalBitcoinsService = req.app.get('service.localbitcoins')

        const { path } = req.query
        const nonce = new Date().getTime() * 1000

        const signature = localBitcoinsService.getMessageSignature(<string>path, req.params, nonce)

        res.json({
            data: { signature }
        })
    }
}