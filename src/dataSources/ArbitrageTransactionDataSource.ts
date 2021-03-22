import { isEmpty } from 'lodash'
import { ArbitrageTransactionDocument } from '../models/ArbitrageTransactionModel'
import OrderModel, { OrderDocument } from '../models/OrderModel'

import TransactionModel, { TransactionDocument } from '../models/TransactionModel'
import UserModel, { UserDocument } from '../models/UserModel'
import { CrudDataSource } from './CrudDataSource'

export default class ArbitrageTransactionDataSource extends CrudDataSource {

    protected name = 'ArbitrageTransaction'
    
    /**
     * Get transaction by ID
     * 
     * @param transationId ID transaction
     */
    async getArbitrageTransaction(arbitrageTransationId: string): Promise<ArbitrageTransactionDocument> {
        const t = await this.model.findOne({ _id: arbitrageTransationId })
            .then(r => <ArbitrageTransactionDocument>r)

        // Find order
        if (!isEmpty(t.orderId)) {
            t.order = await OrderModel.findOne({ _id: t.orderId }).then(r => <OrderDocument>r)
        }

        // Buy transaction
        if (!isEmpty(t.buyTransactionId)) {
            t.buyTransaction = await TransactionModel.findOne({ _id: t.buyTransactionId }).then(r => <TransactionDocument>r)
        }

        // Sell transaction
        if (!isEmpty(t.sellTransactionId)) {
            t.sellTransaction = await TransactionModel.findOne({ _id: t.sellTransactionId }).then(r => <TransactionDocument>r)
        }

        // Find user
        if (!isEmpty(t.userId)) {
            t.user = await UserModel.findOne({ _id: t.userId }).then(r => <UserDocument>r)
        }

        return t
    }
}