import { Request, Express } from 'express'
import { buildFederatedSchema } from '@apollo/federation'
import { ApolloServer } from 'apollo-server-express'

import typeDefs from './schema'
import resolvers from './resolvers'

// Datasources
import AuthDataSource from '../dataSources/AuthDataSource'
import DashboardDataSource from '../dataSources/DashboardDataSource'
import HistoryRateDataSource from '../dataSources/HistoryRateDataSource'
import HourlyRateDataSource from '../dataSources/HourlyRateDataSource'
import HourlyBtcAvgDataSource from '../dataSources/HourlyBtcAvgDataSource'
import OrderDataSource from '../dataSources/OrderDataSource'
import RatesDataSource from '../dataSources/RatesDataSource'
import TransactionDataSource from '../dataSources/TransactionDataSource'

// Models
import HourlyBtcAvgModel from '../models/HourlyBtcAvgModel'
import HistoryRateModel from '../models/HistoryRateModel'
import HourlyRateModel from '../models/HourlyRateModel'
import OrderModel from '../models/OrderModel'
import TransactionModel from '../models/TransactionModel'

import RedisCache from '../utils/RedisCache'
import ArbitrageTransactionDataSource from '../dataSources/ArbitrageTransactionDataSource'
import ArbitrageTransactionModel from '../models/ArbitrageTransactionModel'
import BankTransferDataSource from '../dataSources/BankTransferDataSource'
import BankTransferModel from '../models/BankTransferModel'

const getContext = async ({ headers, app, user }: Request<import("express-serve-static-core").ParamsDictionary>) => {
	return {
		headers,
		app,
		user
	}
}

const apollo = async (app: Express, cache10min: RedisCache) => {
	const federated = []

	// Agregar los tipos y resolvers de raíz
	federated.push({typeDefs, resolvers})

	const server = new ApolloServer({
		schema: buildFederatedSchema(federated),
		debug: true,
		tracing: true,
		cacheControl: true,
        introspection: true,
        // @ts-ignore
		context: async ({ req }) => getContext(req),
		dataSources: () => ({
			arbitrageTransactions: new ArbitrageTransactionDataSource(ArbitrageTransactionModel),
			auth: new AuthDataSource(),
			bankTransfers: new BankTransferDataSource(BankTransferModel),
			dashboard: new DashboardDataSource(app.get('service.localbitcoins'), cache10min),
			historyRates: new HistoryRateDataSource(HistoryRateModel),
			hourlyRates: new HourlyRateDataSource(HourlyRateModel),
			hourlyBycAvg: new HourlyBtcAvgDataSource(HourlyBtcAvgModel),
			rates: new RatesDataSource(app.get('service.localbitcoins'), cache10min),
			orders: new OrderDataSource(OrderModel),
			transactions: new TransactionDataSource(TransactionModel)
		}),
	})

	return server.applyMiddleware({ app, path: '/graphql' })
}

export default apollo