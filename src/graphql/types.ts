import { Express } from 'express'

import RatesDataSource from '../dataSources/RatesDataSource';

export interface ContextResolver {
    app: Express
    dataSources: DataSources
}

export interface DataSources {
    rates: RatesDataSource
}