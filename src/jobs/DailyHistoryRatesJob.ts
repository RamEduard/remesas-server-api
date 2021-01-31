import { schedule } from 'node-cron'
import moment from 'moment'
// import AppRootDir from 'app-root-dir'
// import { writeFileSync } from 'fs'

import { IJob } from '.'

import HourlyRateModel, { HourlyRateDocument } from '../models/HourlyRateModel'
import HistoryRateModel, { HistoryRateDocument } from '../models/HistoryRateModel'

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

export default class DailyHistoryRatesJob implements IJob {
    
    // Every day at 8am and 4pm
    protected cronExpression = '0 */8 * * *'

    constructor() {
        this.execute = this.execute.bind(this)
        this.schedule = this.schedule.bind(this)
    }

    async execute(): Promise<void> {
        console.log(`<<<DailyHistoryRatesJob execute>>>`)
        console.time('DailyHistoryRatesJob')

        try {
            const date = moment.utc().set({ minute: 0, second: 0, millisecond: 0 }).toDate()
            const service = 'LocalBitcoins'

            const PAIR_CURRENCIES: string[] = []
            
            CURRENCIES.forEach((c1) => CURRENCIES.filter((c2) => c1 !== c2).forEach((c2) => PAIR_CURRENCIES.push(`${c1}_${c2}`)))

            // Rates del día o la hora
            const hourlyRatesList = await HourlyRateModel.find({
                date
            })

            const historyRateDocs: Array<any> = []

            // CURRENCY_BTC rates
            hourlyRatesList.forEach((hourlyRate: HourlyRateDocument) => {
                const spread = 1 - (hourlyRate.buy / hourlyRate.sell)

                historyRateDocs.push({
                    pair: hourlyRate.pair,
                    service,
                    date,
                    avg: hourlyRate.avg,
                    buy: hourlyRate.buy,
                    sell: hourlyRate.sell,
                    spread,
                    spreadPercent: Math.round(spread * 100 * 100) / 100
                })
            })

            const historyPairCurrencyDocs: Array<any> = []

            // Calculate rates
            PAIR_CURRENCIES.forEach(pair => {
                const [fromCurrency, toCurrency] = pair.split('_')

                // Find from & to rate
                const rates = historyRateDocs.filter((r: HistoryRateDocument) => r.pair.split('_').indexOf(fromCurrency) === 0 || r.pair.split('_').indexOf(toCurrency) === 0)

                const fromRate = rates.find(rate => rate.pair.split('_').indexOf(fromCurrency) >= 0)
                const toRate = rates.find(rate => rate.pair.split('_').indexOf(toCurrency) >= 0)
                const avg = fromRate.avg / toRate.avg
                const buy = fromRate.sell / toRate.buy
                const sell = fromRate.buy / toRate.sell
                const spread = 1 - (buy / sell)
                const spreadPercent = Math.round(spread * 100 * 100) / 100

                historyPairCurrencyDocs.push({
                    pair: `${fromCurrency}_${toCurrency}`,
                    service,
                    date,
                    avg,
                    buy,
                    sell,
                    spread,
                    spreadPercent
                })
            })

            // Write json files
            // writeFileSync(`${AppRootDir.get()}/data/historyRatesDocs-${date.toISOString()}.json`, JSON.stringify(historyRateDocs, null, 2))
            // writeFileSync(`${AppRootDir.get()}/data/historyPairCurrencyDocs-${date.toISOString()}.json`, JSON.stringify(historyPairCurrencyDocs, null, 2))

            await HistoryRateModel.insertMany([...historyRateDocs, ...historyPairCurrencyDocs])
        } catch (e) {
            console.log(`Error while executing DailyHistoryRatesJob`, e)
        }
        console.timeEnd('DailyHistoryRatesJob')
    }

    schedule(cronObj: { schedule: typeof schedule }): void {
        console.log(`<<<DailyHistoryRatesJob scheduled>>>`)
        cronObj.schedule(this.cronExpression, this.execute)
    }
}