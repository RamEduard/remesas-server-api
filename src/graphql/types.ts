import { Express } from 'express'

import AuthDataSource from '../dataSources/AuthDataSource'
import DashboardDataSource from '../dataSources/DashboardDataSource'
import HistoryRateDataSource from '../dataSources/HistoryRateDataSource'
import HourlyBtcAvgDataSource from '../dataSources/HourlyBtcAvgDataSource'
import HourlyRateDataSource from '../dataSources/HourlyRateDataSource'
import OrderDataSource from '../dataSources/OrderDataSource'
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
    hourlyRates: HourlyRateDataSource
    hourlyBycAvg: HourlyBtcAvgDataSource
    orders: OrderDataSource
    rates: RatesDataSource
    transactions: TransactionDataSource
}