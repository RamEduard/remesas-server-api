import { isEmpty } from 'lodash'

import { BankTransferDocument } from '../models/BankTransferModel'
import TransactionModel, { TransactionDocument } from '../models/TransactionModel'
import UserModel, { UserDocument } from '../models/UserModel'
import { CrudDataSource } from './CrudDataSource'

export default class BankTransferDataSource extends CrudDataSource {

    protected name = 'BankTransfer'
    
    /**
     * Get BankTranfer by ID
     * 
     * @param bankTransferId ID bank transfer
     */
    async getBankTransfer(bankTransferId: string): Promise<BankTransferDocument> {
        // return this.findOneById(transationId).then(r => <TransactionDocument>r)
        const bt = await this.model.findOne({ _id: bankTransferId })
            .then(r => <BankTransferDocument>r)

        // Find transaction
        if (!isEmpty(bt.transactionId)) {
            bt.transaction = await TransactionModel.findOne({ _id: bt.transactionId }).then(r => <TransactionDocument>r)
        }

        // Find user
        if (!isEmpty(bt.userId)) {
            bt.user = await UserModel.findOne({ _id: bt.userId }).then(r => <UserDocument>r)
        }

        return bt
    }
}