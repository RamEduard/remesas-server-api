import { DataSource } from 'apollo-datasource'

import { UserDocument } from '../models/UserModel'

import LocalBitcoinsService from '../services/LocalBitcoins/LocalBitcoinsService'
import RedisCache from '../utils/RedisCache'

export default class DashboardDataSource extends DataSource {
    
    constructor(
        private localBitcoinsService: LocalBitcoinsService,
        private _cache10min: RedisCache
    ) {
        super()
    }

    async dashboardByUser({}, user: UserDocument): Promise<DashboardResponse> {
        const response = <DashboardResponse>{
            btcRates: []
        }

        try {
            // TODO: Save in database a configuration for every user
            const pairsByUser = [
                'USD_ARS',
                'ARS_COP',
                'COP_ARS',
                'ARS_VES',
                'CLP_ARS',
                'ARS_CLP',
            ]
            
            // Average
            const btcAvg = await this.localBitcoinsService.getBtcAvgAllCurrencies()

            // Iterate pairs
            pairsByUser.forEach(pair => {
                const [from, to] = pair.split('_')

                // Search from avg
                const fromAvg = btcAvg[from.toUpperCase()]
                // Search to avg
                const toAvg = btcAvg[to.toUpperCase()]

                response.btcRates.push({
                    label: `${from} to ${to}`,
                    pair,
                    rate: Math.round(Number(toAvg.rates.last) / Number(fromAvg.rates.last) * 100) / 100
                })
            })
        } catch (e) {
            console.log(e)
        }

        return response
    }
}

interface ExchangeRate {
    label: String
    pair: string
    rate: number
}

interface DashboardResponse {
    btcRates: ExchangeRate[]
}