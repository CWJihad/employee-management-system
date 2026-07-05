import {createTransport} from 'nodemailer'
import {SMTP_USER, SMTP_PASS, SENDER_EMAIL} from './config.js'
import SendmailTransport from 'nodemailer/lib/sendmail-transport/index.js';

// Create a transporter using SMTP
const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendEmail = async ({to, subject, body}) => {
    
    const response = await transporter.sendMail({
        from: SENDER_EMAIL,
        to,
        subject,
        html: body
    })

    return response
    
}

export default sendEmail