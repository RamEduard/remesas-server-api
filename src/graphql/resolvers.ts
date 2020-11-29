import AppRootDir from 'app-root-dir'

import { ContextResolver } from './types'

const resolvers = {
	Query: {
        version: () => {
			const pjson = require(`${AppRootDir.get()}/package.json`)
			return pjson.version
		},
		info: () => {
			const pjson = require(`${AppRootDir.get()}/package.json`)
			return {
				author: pjson.author,
				title: pjson.description,
				version: pjson.version,
			}
		},
		localBitcoinsAvgAllCurrencies: (_: any, args: any, { dataSources }: ContextResolver) =>
			dataSources.rates.btcAvg(args),
		ratesByCurrency: (_: any, { currencyCode, filters }: any, { dataSources }: ContextResolver) =>
			dataSources.rates.ratesByCurrency(currencyCode, filters)
    }
}

export default resolvers