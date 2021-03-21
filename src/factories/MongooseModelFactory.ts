import { Document } from 'mongoose'

import { IDocument } from '../dataSources/CrudDataSource'

import ArbitrageTransactionModel from '../models/ArbitrageTransactionModel'
import CommentModel from '../models/CommentModel'
import HistoryRateModel from '../models/HistoryRateModel'
import OrderModel from '../models/OrderModel'
import TransactionModel from '../models/TransactionModel'
import UserModel from '../models/UserModel'

export default class MongooseModelFactory {

    public static createModel(type: string, document: Document): IDocument {
        switch(type) {
            // ArbitrageTransactionModel
            case 'ArbitrageTransaction':
                return new ArbitrageTransactionModel(document)
            // CommentModel
            case 'Comment':
                return new CommentModel(document)
            // HistoryRateModel
            case 'HistoryRate':
                return new HistoryRateModel(document)
            // OrderRateModel
            case 'Order':
                return new OrderModel(document)
            // TransactionModel
            case 'Transaction':
                return new TransactionModel(document)
            // UserModel
            case 'User':
                return new UserModel(document)
            default:
                throw new Error(`Model ${type} not found`)
        }
    }
}