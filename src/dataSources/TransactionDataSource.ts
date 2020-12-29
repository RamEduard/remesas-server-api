import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ApolloError } from 'apollo-server'

import TransactionModel, { TransactionDocument } from '../models/TransactionModel'
import { UserDocument } from '../models/UserModel'

export default class TransactionDataSource extends MongoDataSource<TransactionDocument> {

    async getAll(filters = {}, user: UserDocument) {
        return this.model.find(filters)
    }
    
    /**
     * Get transaction by ID
     * 
     * @param transationId ID transaction
     */
    getTransaction(transationId: string) {
        return this.findOneById(transationId)
    }

    /**
     * Create transaction
     * 
     * @param document 
     */
    async create(document: TransactionDocument, user: UserDocument) {
        try {
            const transaction = new TransactionModel(document)

            transaction.userId = user._id
            
            await transaction.save()

            return transaction
        } catch (e) {
            console.log('Error creating transaction', e)
            
            return new ApolloError('Error creating transaction', '400', e)
        }
    }

    /**
     * Update transaction
     * 
     * @param document Document to update
     * @param user     Authenticated user
     */
    async update(document: TransactionDocument, user: UserDocument) {
        try {
            const transaction = await this.model.findById(document._id)

            if (!transaction) return new ApolloError('Transaction not found', '404')

            if (transaction.userId != user._id) return new ApolloError('Forbiden', '403')

            await this.model.updateOne({ _id: transaction._id }, { $set: document })

            return { ...transaction, ...document }
        } catch (e) {
            console.log('Error updating transaction', e)
            return new ApolloError('Error updating transaction', '400', e)
        }
    }

    /**
     * Delete transaction
     * 
     * @param _id  ID transaction
     * @param user Authenticated user
     */
    async delete(_id: String, user: UserDocument) {
        try {
            const transaction = await this.model.findById(_id)

            if (!transaction) return new ApolloError('Transaction not found', '404')

            if (transaction.userId.toString() !== user._id.toString()) return new ApolloError('Forbiden', '403')

            const q = await this.model.deleteOne({ _id: transaction._id })

            return (q.n && q.n > 0)
        } catch (e) {
            console.log('Error deleting transaction', e)
            return new ApolloError('Error deleting transaction', '400', e)
        }
    }
}