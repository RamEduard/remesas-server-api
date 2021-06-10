import BullQueue from 'bull'
import nodemailer from 'nodemailer'

import { REDIS_HOST, REDIS_PORT, SES_SMTP_USERNAME, SES_SMTP_PASSWORD } from '../config'

const smtpTransporter = nodemailer.createTransport({
	port: 465,
	host: 'email-smtp.us-east-1.amazonaws.com',
	secure: true,
	auth: {
		user: SES_SMTP_USERNAME,
		pass: SES_SMTP_PASSWORD
	},
	debug: true,
})

// Email Queue
export const emailQueue = new BullQueue('send-email', {
    redis: {
        port: <number>REDIS_PORT || 6379,
        host: REDIS_HOST || 'localhost',
    },
})

export default () => {
	// Process email queue
	emailQueue.process((job, done) => {
		try {
            const { subject, from, to, text, html } = job.data

            if (!subject || !from || !to || !text || !html) {
                return done(new Error('Invalid data'))
            }

			console.log(`Sending email to ${job.data.to}`)

            smtpTransporter.sendMail(job.data, (err, info) => {
                if (err) return done(err)

                console.log(`Email sent ${info.messageId}`)

                done(null, info)
            })
		} catch (e) {
			done(e)
		}
	})

    emailQueue.on('error', (err) => {
        console.log(`Something wrong occurred sending email`, err)
    })
}
