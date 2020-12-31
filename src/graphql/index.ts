import { Request, Express } from 'express'
import { buildFederatedSchema } from '@apollo/federation'
import { ApolloServer } from 'apollo-server-express'

import typeDefs from './schema'
import resolvers from './resolvers'

// Datasources
import RatesDataSource from '../dataSources/RatesDataSource'
import AuthDataSource from '../dataSources/AuthDataSource'
import DashboardDataSource from '../dataSources/DashboardDataSource'
import TransactionDataSource from '../dataSources/TransactionDataSource'

// Models
import TransactionModel from '../models/TransactionModel'

import RedisCache from '../utils/RedisCache'
import HistoryRateDataSource from '../dataSources/HistoryRateDataSource'
import HistoryRateModel from '../models/HistoryRateModel'

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
			auth: new AuthDataSource(),
			dashboard: new DashboardDataSource(app.get('service.localbitcoins'), cache10min),
			historyRates: new HistoryRateDataSource(HistoryRateModel),
			rates: new RatesDataSource(app.get('service.localbitcoins'), cache10min),
			transactions: new TransactionDataSource(TransactionModel)
		}),
	})

	return server.applyMiddleware({ app, path: '/graphql' })
}

export default apollo