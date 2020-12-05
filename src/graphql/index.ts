import { Request, Express } from 'express'
import { buildFederatedSchema } from '@apollo/federation'
import { ApolloServer } from 'apollo-server-express'

import typeDefs from './schema'
import resolvers from './resolvers'
import RatesDataSource from '../dataSources/RatesDataSource'
import RedisCache from '../utils/RedisCache'
import AuthDataSource from '../dataSources/AuthDataSource'
import DashboardDataSource from '../dataSources/DashboardDataSource'

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
			rates: new RatesDataSource(app.get('service.localbitcoins'), cache10min)
		}),
	})

	return server.applyMiddleware({ app, path: '/graphql' })
}

export default apollo