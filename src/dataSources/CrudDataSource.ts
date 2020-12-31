import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ApolloError } from 'apollo-server'
import { Document, Schema } from 'mongoose'
import MongooseModelFactory from '../factories/MongooseModelFactory'

import { UserDocument } from '../models/UserModel'

export interface IDocument extends Document {
    userId?: Schema.Types.ObjectId | String
}

export interface IDocumentList {
    hasNext: boolean
    nextPage: number
    items: IDocument[]
    pages: number
    total: number
}

export interface ICrudDataSource {
    getAll(filters: any, pageSize: number, pageNumber: number): Promise<IDocumentList>

    create(document: IDocument, user: UserDocument): Promise<IDocument | ApolloError>

    update(document: IDocument, user: UserDocument): Promise<IDocument | ApolloError>

    delete(_id: String, user: UserDocument): Promise<Boolean | ApolloError>
}

export class CrudDataSource extends MongoDataSource<IDocument> implements ICrudDataSource {
    protected name: string = 'Crud'

    /**
     * Get all documents action
     * 
     * @param filters    Filters for collection.find
     * @param pageSize   Pagination size
     * @param pageNumber Current page
     */
    async getAll(filters: any = {}, pageSize: number = 12, pageNumber: number = 1): Promise<IDocumentList> {
        const items = await this.model.find(filters)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .then((r) => r.map((o) => <IDocument>o))

        const total = await this.model.find(filters).countDocuments()
        const pages = Math.ceil(items.length / pageSize)

        return {
            hasNext: pages > 1,
            nextPage: (pageNumber + 1 <= pages) ? pageNumber + 1 : pageNumber,
            total,
            items,
            pages
        }
    }

    /**
     * Create action
     * 
     * @param document Document to create
     * @param user     User Authenticated
     */
    async create(document: any, user: UserDocument): Promise<IDocument | ApolloError> {
        try {
            const doc = MongooseModelFactory.createModel(this.name, document)

            if (user) doc.userId = user._id

            await doc.save()

            return <IDocument>doc
        } catch (e) {
            console.log(`Error creating ${this.name}`, e)

            return new ApolloError(`Error creating ${this.name}`, '400', e)
        }
    }

    /**
     * Update action
     * 
     * @param document Object to update
     * @param user     User Authenticated
     */
    async update(document: any, user: UserDocument): Promise<IDocument | ApolloError> {
        try {
            const doc = await this.model.findById(document._id)

            if (!doc) return new ApolloError(`${this.name} not found`, '404')

            if (doc.userId != user._id) return new ApolloError('Forbiden', '403')

            await this.model.updateOne({ _id: doc._id }, { $set: document })

            return <IDocument>{ ...doc, ...document }
        } catch (e) {
            console.log(`Error updating ${this.name}`, e)
            return new ApolloError(`Error updating ${this.name}`, '400', e)
        }
    }

    /**
     * Delete document action
     * 
     * @param _id  Document ID
     * @param user User Authenticated
     */
    async delete(_id: String, user: UserDocument): Promise<Boolean | ApolloError> {
        try {
            const doc = await this.model.findById(_id)

            if (!doc) return new ApolloError(`${this.name} not found`, '404')

            if (doc.userId?.toString() !== user._id.toString()) return new ApolloError('Forbiden', '403')

            const q = await this.model.deleteOne({ _id: doc._id })

            return <Boolean> (q.n && q.n > 0)
        } catch (e) {
            console.log(`Error deleting ${this.name}`, e)
            return new ApolloError(`Error deleting ${this.name}`, '400', e)
        }
    }
}
