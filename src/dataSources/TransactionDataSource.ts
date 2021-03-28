import { isEmpty } from 'lodash'
import BankTransferModel, { BankTransferDocument } from '../models/BankTransferModel'
import OrderModel, { OrderDocument } from '../models/OrderModel'

import { TransactionDocument } from '../models/TransactionModel'
import UserModel, { UserDocument } from '../models/UserModel'
import { CrudDataSource } from './CrudDataSource'

export default class TransactionDataSource extends CrudDataSource {

    protected name = 'Transaction'
    
    /**
     * Get transaction by ID
     * 
     * @param transationId ID transaction
     */
    async getTransaction(transationId: string): Promise<TransactionDocument> {
        // return this.findOneById(transationId).then(r => <TransactionDocument>r)
        const t = await this.model.findOne({ _id: transationId })
            .then(r => <TransactionDocument>r)
        
        if (isEmpty(t)) return <TransactionDocument>{}

        // Find bank transfers
        if (!isEmpty(t.bankTransferIds)) {
            t.bankTransfers = await BankTransferModel.find({ _id: {$in: t.bankTransferIds} })
                .populate('user')
                .exec()
                .then(r => <[BankTransferDocument]>r)
        } else {
            t.bankTransfers = await BankTransferModel.find({ transactionId: t._id })
                .populate('user')
                .exec()
                .then(r => <[BankTransferDocument]>r)
        }

        // Find order
        if (!isEmpty(t.orderId)) {
            t.order = await OrderModel.findOne({ _id: t.orderId }).then(r => <OrderDocument>r)
        }

        // Find user
        if (!isEmpty(t.userId)) {
            t.user = await UserModel.findOne({ _id: t.userId }).then(r => <UserDocument>r)
        }

        return t
    }
}