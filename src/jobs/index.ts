import { schedule } from 'node-cron'
import JobFactory from '../factories/JobFactory'

export interface IJob {
    
    /**
     * Execute task
     */
    execute(): void

    /**
     * Schedule job on node-cron
     * @param cronObj 
     */
    schedule(cronObj: { schedule: typeof schedule }): void
}

const ENABLED_JOBS = ['HourlyRates', 'DailyHistoryRates', 'DailyEmailRates']

export const register = (cronObj: { schedule: typeof schedule }) => {
    ENABLED_JOBS.forEach(jobName => {
        // Schedule each job
        const job = JobFactory.create(jobName)
        job.schedule(cronObj)
    })
}

export default { register }
