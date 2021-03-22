import { ApolloError } from 'apollo-server'
import isEmpty from 'lodash/isEmpty'

import { OrderDocument } from '../models/OrderModel'
import TransactionModel, { TransactionDocument } from '../models/TransactionModel'
import UserModel, { UserDocument } from '../models/UserModel'
import { CrudDataSource, IDocument } from './CrudDataSource'

export default class OrderDataSource extends CrudDataSource {

    protected name = 'Order'
    
    /**
     * Get order by ID
     * 
     * @param orderId ID order
     */
    async getOrder(orderId: string): Promise<OrderDocument> {
        const order = await this.model.findOne({ _id: orderId })
            .then(r => <OrderDocument>r)
        
        if (isEmpty(order)) return <OrderDocument>{}

        // Find order
        if (!isEmpty(order.transactionIds)) {
            order.transactions = await TransactionModel.find({ _id: {$in: order.transactionIds} })
                .populate('user')
                .exec()
                .then(r => <[TransactionDocument]>r)
        } else {
            order.transactions = await TransactionModel.find({ orderId })
                .populate('user')
                .exec()
                .then(r => <[TransactionDocument]>r)
        }

        // Find user client
        if (!isEmpty(order.userClientId)) {
            order.userClient = await UserModel.findOne({ _id: order.userClientId }).then(r => <UserDocument>r)
        }

        // Find user seller
        if (!isEmpty(order.userId)) {
            order.user = await UserModel.findOne({ _id: order.userId }).then(r => <UserDocument>r)
        }

        return order
    }

    /**
     * Create order
     * 
     * @override
     * @param document Document to create
     * @param user     User Authenticated
     */
    async create(document: any, user: UserDocument): Promise<IDocument | ApolloError> {
        document.token = '1234567890.!'

        return super.create(document, user)
    }
}