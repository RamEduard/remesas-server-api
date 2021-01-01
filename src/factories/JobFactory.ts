import HourlyRatesJob from '../jobs/HourlyRatesJob'
import { IJob } from '../jobs'

export default class JobFactory {
    public static create(jobName: string): IJob {
        switch(jobName) {
            // HourlyRatesJob
            case 'HourlyRates':
                return new HourlyRatesJob()
            default:
                throw new Error(`Job ${jobName} not found`)
        }
    }
}