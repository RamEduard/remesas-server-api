import AppRootDir from 'app-root-dir'
import { isEmpty } from 'lodash'

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
		/**
		 * All avg btc currencies
		 */
		localBitcoinsAvgAllCurrencies: (_: any, args: any, { dataSources, user }: ContextResolver) =>
			!isEmpty(user) && dataSources.rates.btcAvg(args),
		/**
		 * Rates by currency
		 */
		ratesByCurrency: (_: any, { currencyCode, filters }: any, { dataSources, user }: ContextResolver) =>
			!isEmpty(user) && dataSources.rates.ratesByCurrency(currencyCode, filters),
		/**
		 * User info
		 */
		userInfo: (_: any, args: any, { user }: ContextResolver) => user,
		/**
		 * Dashboard by user
		 */
		dashboard: (_: any, args: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.dashboard.dashboardByUser(args, user),
		/**
		 * LocalBitcoins buy
		 */
		localBitcoinsBuy: (_: any, { currencyCode, filters }: any, { dataSources, user }: ContextResolver) =>
			!isEmpty(user) && dataSources.rates.localBitcoinsBuy(currencyCode, filters),
		/**
		 * LocalBitcoins buy
		 */
		localBitcoinsSell: (_: any, { currencyCode, filters }: any, { dataSources, user }: ContextResolver) =>
			!isEmpty(user) && dataSources.rates.localBitcoinsSell(currencyCode, filters),
	},
	Mutation: {
		signin: (_: any, { email, password }: any, { dataSources }: ContextResolver) => 
			dataSources.auth.signin(email, password),
		signup: (_: any, { user }: any, { dataSources }: ContextResolver) => 
			dataSources.auth.signup(user)
	}
}

export default resolvers