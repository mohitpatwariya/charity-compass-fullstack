const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    //service: 'Gmail'
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS
    }
});

async function mailSender(to, subject, body) {
    const mailOptions = {
        from: 'StudyNotion || Ayush',
        to,
        subject,
        html: body
    };
    return await mailTransporter.sendMail(mailOptions);
}

module.exports = mailSender;