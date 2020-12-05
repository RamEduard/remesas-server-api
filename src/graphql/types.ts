import { Express } from 'express'

import AuthDataSource from '../dataSources/AuthDataSource'
import DashboardDataSource from '../dataSources/DashboardDataSource'
import RatesDataSource from '../dataSources/RatesDataSource'

import { UserDocument } from '../models/UserModel'

export interface ContextResolver {
    app: Express
    dataSources: DataSources,
    user: UserDocument
}

export interface DataSources {
    auth: AuthDataSource
    dashboard: DashboardDataSource
    rates: RatesDataSource
}