import { ApolloError } from 'apollo-server'
import { OrderDocument } from '../models/OrderModel'
import { UserDocument } from '../models/UserModel'
import { CrudDataSource, IDocument } from './CrudDataSource'

export default class OrderDataSource extends CrudDataSource {

    protected name = 'Order'
    
    /**
     * Get order by ID
     * 
     * @param orderId ID order
     */
    async getOrder(orderId: string): Promise<OrderDocument> {
        return this.findOneById(orderId).then(r => <OrderDocument>r)
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