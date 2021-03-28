import { Express } from 'express'

import ArbitrageTransactionDataSource from '../dataSources/ArbitrageTransactionDataSource'
import AuthDataSource from '../dataSources/AuthDataSource'
import BankTransferDataSource from '../dataSources/BankTransferDataSource'
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
    arbitrageTransactions: ArbitrageTransactionDataSource
    auth: AuthDataSource
    bankTransfers: BankTransferDataSource
    dashboard: DashboardDataSource
    historyRates: HistoryRateDataSource
    hourlyRates: HourlyRateDataSource
    hourlyBycAvg: HourlyBtcAvgDataSource
    orders: OrderDataSource
    rates: RatesDataSource
    transactions: TransactionDataSource
}