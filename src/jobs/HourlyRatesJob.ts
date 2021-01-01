import AppRootDir from 'app-root-dir'
import { schedule } from 'node-cron'
import { writeFileSync } from 'fs'

import { IJob } from '.'

import { localBitcoinsService } from '../services'
import HourlyBtcAvgModel from '../models/HourlyBtcAvgModel'
import HourlyRateModel from '../models/HourlyRateModel'

const CURRENCIES = [
    'ARS',
    'CLP',
    'COP',
    'EUR',
    'PEN',
    'USD',
    'VES',
    'MXN',
    'BRL'
]

export default class HourlyRatesJob implements IJob {
    
    // Every hour
    protected cronExpression = '40 */1 * * *'

    constructor() {
        this.execute = this.execute.bind(this)
        this.schedule = this.schedule.bind(this)
    }

    async execute(): Promise<void> {
        console.log(`<<<HourlyRatesJob execute>>>`)
        console.time('HourlyRatesJob')
        try {
            // Datetime
            const date = new Date()
            const service = 'LocalBitcoins'

            // BTC avg - all currencies
            const btcAvg = await localBitcoinsService.getBtcAvgAllCurrencies(true)

            // filter by Currencies
            const btcAvgByCurrency = Object.keys(btcAvg)
                .filter(key => CURRENCIES.indexOf(key) >= 0)
                .map(key => ({
                    ...btcAvg[key],
                    currency: key
                }))

            const hourlyBtcAvgDocs = []

            for (let i = 0; i < btcAvgByCurrency.length; i++) {
                hourlyBtcAvgDocs.push({
                    date,
                    service,
                    currency: btcAvgByCurrency[i].currency,
                    avg6h: Number(btcAvgByCurrency[i].avg_6h),
                    avg12h: Number(btcAvgByCurrency[i].avg_12h),
                    avg24h: Number(btcAvgByCurrency[i].avg_24h),
                    last: Number(btcAvgByCurrency[i].rates.last),
                    volumeBtc: Number(btcAvgByCurrency[i].volume_btc),
                })
            }

            // TODO: Mejorar y pasar a cola

            const hourlyRatesDocs = []

            for (let i = 0; i < CURRENCIES.length; i++) {
                const currencyCode = CURRENCIES[i]

                const [buy, sell] = await Promise.all([
                    localBitcoinsService.getBuyBitcoinsOnline(currencyCode),
                    localBitcoinsService.getSellBitcoinsOnline(currencyCode)
                ])

                hourlyRatesDocs.push({
                    date,
                    service,
                    pair: `${currencyCode}_BTC`,
                    buy: Number(buy?.ad_list[0].data.temp_price),
                    sell: Number(sell?.ad_list[0].data.temp_price),
                    avg: Number(btcAvg[currencyCode].rates.last)
                })
            }

            // Write json files
            writeFileSync(`${AppRootDir.get()}/data/hourlyBtcAvgDocs-${date.toISOString()}.json`, JSON.stringify(hourlyBtcAvgDocs, null, 2))

            writeFileSync(`${AppRootDir.get()}/data/hourlyRatesDocs-${date.toISOString()}.json`, JSON.stringify(hourlyRatesDocs, null, 2))

            await HourlyBtcAvgModel.insertMany(hourlyBtcAvgDocs)

            await HourlyRateModel.insertMany(hourlyRatesDocs)
        } catch (e) {
            console.log(`Error while executing HourlyRatesJob`, e)
        }
        console.timeEnd('HourlyRatesJob')
    }

    schedule(cronObj: { schedule: typeof schedule }): void {
        console.log(`<<<HourlyRatesJob scheduled>>>`)
        cronObj.schedule(this.cronExpression, this.execute)
    }

}