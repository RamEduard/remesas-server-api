import { HistoryRateDocument } from '../models/HistoryRateModel'
import { CrudDataSource } from './CrudDataSource'

export default class HistoryRateDataSource extends CrudDataSource {
    protected name = 'HistoryRate'

    async getHistoryRate(historyRateId: string): Promise<HistoryRateDocument> {
        return this.findOneById(historyRateId).then(r => <HistoryRateDocument> r)
    }
}