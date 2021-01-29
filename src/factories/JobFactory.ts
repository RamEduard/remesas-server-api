import { IJob } from '../jobs'
import HourlyRatesJob from '../jobs/HourlyRatesJob'
import DailyHistoryRatesJob from '../jobs/DailyHistoryRatesJob'

export default class JobFactory {
    public static create(jobName: string): IJob {
        switch(jobName) {
            // HourlyRatesJob
            case 'HourlyRates':
                return new HourlyRatesJob()
            // DailyHistoryRatesJob
            case 'DailyHistoryRates':
                return new DailyHistoryRatesJob()
            default:
                throw new Error(`Job ${jobName} not found`)
        }
    }
}