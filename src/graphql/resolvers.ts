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
		/**
		 * Transactions
		 */
		transactionsList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.transactions.getAll(filters),
		/**
		 * History rates
		 */
		historyRatesList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.historyRates.getAll(filters)
	},
	Mutation: {
		signin: (_: any, { email, password }: any, { dataSources }: ContextResolver) => 
			dataSources.auth.signin(email, password),
		signup: (_: any, { user }: any, { dataSources }: ContextResolver) => 
			dataSources.auth.signup(user),
		/**
		 * Create transaction
		 */
		transactionCreate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.transactions.create(input, user),
		/**
		 * Delete transaction
		 */
		transactionDelete: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.transactions.delete(_id, user),
		/**
		 * Update transaction
		 */
		transactionUpdate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.transactions.update(input, user),
		/**
		 * Create history rate
		 */
		historyRateCreate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.historyRates.create(input, user),
		/**
		 * Delete history rate
		 */
		historyRateDelete: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.historyRates.delete(_id, user),
		/**
		 * Update history rate
		 */
		historyRateUpdate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.historyRates.update(input, user)
	}
}

export default resolvers