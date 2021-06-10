import { IJob } from '../jobs'
import HourlyRatesJob from '../jobs/HourlyRatesJob'
import DailyHistoryRatesJob from '../jobs/DailyHistoryRatesJob'
import DailyEmailRatesJob from '../jobs/DailyEmailRatesJob'

export default class JobFactory {
    public static create(jobName: string): IJob {
        switch(jobName) {
            // HourlyRatesJob
            case 'HourlyRates':
                return new HourlyRatesJob()
            // DailyHistoryRatesJob
            case 'DailyHistoryRates':
                return new DailyHistoryRatesJob()
            case 'DailyEmailRates':
                return new DailyEmailRatesJob()
            default:
                throw new Error(`Job ${jobName} not found`)
        }
    }
}