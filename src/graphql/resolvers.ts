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
			dataSources.rates.ratesByCurrency(currencyCode, filters),
		userInfo: (_: any, args: any, { user }: ContextResolver) => user
	},
	Mutation: {
		signin: (_: any, { email, password }: any, { dataSources }: ContextResolver) => 
			dataSources.auth.signin(email, password),
		signup: (_: any, { user }: any, { dataSources }: ContextResolver) => 
			dataSources.auth.signup(user)
	}
}

export default resolvers