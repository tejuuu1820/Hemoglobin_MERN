const nodemailer = require('nodemailer')
const config = require('./config')

const transporter = nodemailer.createTransport({
    service: config.mail.SMTP_MAIL_SERVICE,
    auth: {
        user: config.mail.SMTP_MAIL_USER,
        pass: config.mail.SMTP_MAIL_PASSWORD
    }
})

async function sendMail(options) {
    try {
        if (!options || !options.to || !options.subject || !options.html) {
            throw Error('Missing Options')
        }

        if (!transporter) {
            throw Error('Transporter is not defined')
        }

        const mailOptions = {
            to: options.to,
            subject: options.subject,
            html: options.html,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error Occurred: ", error.message);
            } else {
                console.log("Email sent successfully");
            }
        })
    } catch (e) {
        throw Error(e)
    }
}

module.exports = sendMail