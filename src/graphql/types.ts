import { Express } from 'express'

import AuthDataSource from '../dataSources/AuthDataSource'
import RatesDataSource from '../dataSources/RatesDataSource'

import { UserDocument } from '../models/UserModel'

export interface ContextResolver {
    app: Express
    dataSources: DataSources,
    user: UserDocument
}

export interface DataSources {
    rates: RatesDataSource
    auth: AuthDataSource
}