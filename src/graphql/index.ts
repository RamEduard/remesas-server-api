import { Request, Express } from 'express'
import { buildFederatedSchema } from '@apollo/federation'
import { ApolloServer } from 'apollo-server-express'

import typeDefs from './schema'
import resolvers from './resolvers'

const getContext = async ({ headers, app }: Request<import("express-serve-static-core").ParamsDictionary>) => {
	return {
		headers,
        app
	}
}

const apollo = async (app: Express) => {
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
		// dataSources: () => DataSources({ backofficeDb, hotelDb }),
	})

	return server.applyMiddleware({ app, path: '/' })
}

export default apollo