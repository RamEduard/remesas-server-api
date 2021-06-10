import { schedule } from 'node-cron'
import moment from 'moment'

import { IJob } from '.'

import { localBitcoinsService } from '../services'

import { emailQueue } from '../queues/index'

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

export const VALID_PAIRS = [
	'USD_ARS',
	'USD_COP',
	'USD_VES',

	'EUR_ARS',
	'EUR_COP',
	'EUR_VES',

	'ARS_VES',
	'COP_ARS',
	'ARS_COP',
	'CLP_ARS',
	'ARS_CLP',
]

const Fare = (amount: number, decimals = 2, symbol = '$') => {
	if (!amount || typeof amount.toFixed !== 'function') return null

	if (symbol === null || symbol === '') symbol = '€'

	let [num, numDecimal] = amount.toString().split('.')

	if (isNaN(parseInt(numDecimal)) && decimals > 0) numDecimal = '0'.repeat(decimals)

	return `${symbol} ${num.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${decimals > 0 && `,${numDecimal.substring(0, decimals)}`}`
}

export default class DailyEmailRatesJob implements IJob {
    
    // Every day at 8am and 4pm
    protected cronExpression = '0 */8 * * *'

    constructor() {
        this.execute = this.execute.bind(this)
        this.schedule = this.schedule.bind(this)
    }

    async execute(): Promise<void> {
        console.log(`<<<DailyEmailRatesJob execute>>>`)
        console.time('DailyEmailRatesJob')

        // Datetime
        const date = moment.utc().set({ minute: 0, second: 0, millisecond: 0 }).toDate()
        const service = 'LocalBitcoins'

        // BTC avg - all currencies
        const btcAvg = await localBitcoinsService.getBtcAvgAllCurrencies(true)

        // filter by Currencies
        const btcAvgByCurrency = {}
        
        Object.keys(btcAvg)
            .filter(key => CURRENCIES.indexOf(key) >= 0)
            .map(key => {
                // @ts-ignore
                btcAvgByCurrency[key] = btcAvg[key]
            })

        const ratesArr: any = []

        // Iterate pairs
        VALID_PAIRS.forEach(pair => {
            const [from, to] = pair.split('_')

            // Search from avg
            const fromAvg = btcAvg[from.toUpperCase()]
            // Search to avg
            const toAvg = btcAvg[to.toUpperCase()]

            // TODO: buy, sell, spread (solo para remesadores/arbitros)
            ratesArr.push({
                label: `${from} to ${to}`,
                pair,
                rate: (Number(toAvg.rates.last) / Number(fromAvg.rates.last)).toFixed(2)
            })
        })
        
        let textHtml = `
        <h1>Rates Average</h1>
        <table>
        <thead>
            <tr>
                <th>Pair</th>
                <th>Rate</th>
            </tr>
        </thead>
        <tbody>`

        // @ts-ignore
        ratesArr.forEach(({ pair, rate }) => {
            textHtml += `<tr>
            <td>${pair}</td>
            <td align="right">${Fare(parseFloat(rate), 2, ' ')}</td>
            </tr>`
        })

        textHtml += `</tbody></table>`

        emailQueue.add({
            from: 'rameduardserrano@gmail.com',
            to: 'rameduardserrano@gmail.com',
            subject: `Rates Average for ${moment(date).format('YYYY-MM-DD HH:mm')}`,
            // @ts-ignore
            text: `Rates Average \n\n ` + ratesArr.map(({ pair, rate }) => `${pair}: ${rate}`).join('\n'),
            html: textHtml
        })
    }

    schedule(cronObj: { schedule: typeof schedule }): void {
        console.log(`<<<DailyEmailRatesJob scheduled>>>`)
        cronObj.schedule(this.cronExpression, this.execute)
    }
}