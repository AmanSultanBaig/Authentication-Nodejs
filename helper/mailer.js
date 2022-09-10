const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_ACCOUNT_EMAIL,
        pass: process.env.MAIL_ACCOUNT_PASSWORD
    }
});

const triggerEmail = async (mailObject, flag) => {
    const { from, to, subject, text, html } = mailObject;

    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        replyTo: to
    };

    flag == 'html' ? mailOptions['html'] = html : mailOptions['text'] = text

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = triggerEmail
