import { Express } from 'express'

import AuthDataSource from '../dataSources/AuthDataSource'
import DashboardDataSource from '../dataSources/DashboardDataSource'
import HistoryRateDataSource from '../dataSources/HistoryRateDataSource'
import RatesDataSource from '../dataSources/RatesDataSource'
import TransactionDataSource from '../dataSources/TransactionDataSource'

import { UserDocument } from '../models/UserModel'

export interface ContextResolver {
    app: Express
    dataSources: DataSources,
    user: UserDocument
}

export interface DataSources {
    auth: AuthDataSource
    dashboard: DashboardDataSource
    historyRates: HistoryRateDataSource
    rates: RatesDataSource
    transactions: TransactionDataSource
}