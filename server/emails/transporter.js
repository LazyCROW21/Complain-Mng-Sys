const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADR,
        pass: process.env.EMAIL_PWD
    },
});

const sendMail = (data) => {
    return transporter.sendMail({
        from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL_ADR}>`,
        to: data.to,
        subject: data.subject,
        text: data.body
    });
}

module.exports = sendMail