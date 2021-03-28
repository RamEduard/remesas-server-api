import AppRootDir from 'app-root-dir'
import { GraphQLScalarType, Kind } from 'graphql'
import { isEmpty } from 'lodash'

import { ContextResolver } from './types'

const resolvers = {
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue(value) {
			return new Date(value)
		},
		serialize(value) {
			return value.toISOString()
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return parseInt(ast.value, 10)
			}
			return null
		}
	}),
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
		 * Transaction get
		 */
		transactionGet: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.transactions.getTransaction(_id),
		/**
		 * Transactions
		 */
		transactionsList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.transactions.getAll(filters),
		/**
		 * History rates
		 */
		historyRatesList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.historyRates.getAll(filters),
		/**
		 * Hourly rates
		 */
		hourlyRatesList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.hourlyRates.getAll(filters),
		/**
		 * Hourly Btc Avg
		 */
		historyBtcAvgList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.hourlyBycAvg.getAll(filters),
		/**
		 * Order get
		 */
		orderGet: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.orders.getOrder(_id),
		/**
		 * OrderUser - id,token
		 */
		orderByIdAndToken: (_: any, { _id, token }: any, { dataSources }: ContextResolver) =>
			dataSources.orders.getOrderByIdAndToken(_id, token),
		/**
		 * Orders
		 */
		ordersList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.orders.getAll(filters),
		/**
		 * Transaction get
		 */
		arbitrageTransactionGet: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.arbitrageTransactions.getArbitrageTransaction(_id),
		/**
		 * Transactions
		 */
		arbitrageTransactionsList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.arbitrageTransactions.getAll(filters),
		/**
		 * BankTransfer get
		 */
		bankTransferGet: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.bankTransfers.getBankTransfer(_id),
		/**
		 * BankTransfer
		 */
		bankTransfersList: (_: any, { filters }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.bankTransfers.getAll(filters),
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
			!isEmpty(user) && dataSources.historyRates.update(input, user),
		/**
		 * Create order
		 */
		orderCreate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.orders.create(input, user),
		/**
		 * Delete order
		 */
		orderDelete: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.orders.delete(_id, user),
		/**
		 * Update order
		 */
		orderUpdate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.orders.update(input, user),
		/**
		 * Create transaction
		 */
		arbitrageTransactionCreate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.arbitrageTransactions.create(input, user),
		/**
		 * Delete transaction
		 */
		arbitrageTransactionDelete: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.arbitrageTransactions.delete(_id, user),
		/**
		 * Update transaction
		 */
		arbitrageTransactionUpdate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.arbitrageTransactions.update(input, user),
		/**
		 * Create transaction
		 */
		bankTransferCreate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.bankTransfers.create(input, user),
		/**
		 * Delete transaction
		 */
		bankTransferDelete: (_: any, { _id }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.bankTransfers.delete(_id, user),
		/**
		 * Update transaction
		 */
		bankTransferUpdate: (_: any, { input }: any, { dataSources, user }: ContextResolver) => 
			!isEmpty(user) && dataSources.bankTransfers.update(input, user),
	}
}

export default resolvers