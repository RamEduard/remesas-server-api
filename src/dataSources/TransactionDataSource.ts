import { TransactionDocument } from '../models/TransactionModel'
import { CrudDataSource } from './CrudDataSource'

export default class TransactionDataSource extends CrudDataSource {

    protected name = 'Transaction'
    
    /**
     * Get transaction by ID
     * 
     * @param transationId ID transaction
     */
    async getTransaction(transationId: string): Promise<TransactionDocument> {
        return this.findOneById(transationId).then(r => <TransactionDocument>r)
    }
}