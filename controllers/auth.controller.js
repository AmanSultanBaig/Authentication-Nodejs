const sendEmail = require("../helper/mailer");
const jwt = require("jsonwebtoken")
const userModel = require("../models/auth.model")

const signUp = async (req, res) => {
    const { email } = req.body;
    try {
        const isExist = await userModel.findOne({ email: email.trim() })
        if (isExist) {
            return res.status(404).json({
                data: {},
                status: false,
                message: `User already exist with this ${email}`
            })
        }
        let verificationToken = jwt.sign(req.body, process.env.VERIFICATION_SECRET_KEY, { expiresIn: "10m" })

        let mailObject = {
            from: process.env.MAIL_ACCOUNT_EMAIL,
            to: email,
            subject: 'Account Activation',
            html: `<p>Please click to given link below to verify your account!</p>
            <a href='${process.env.FRONTENT_URL}/verify/${verificationToken}'>Verify Account Now!<a/>
            `
        }
        await sendEmail(mailObject, "html")
        res.status(200).json({
            data: {},
            status: true,
            message: `Account has been created! Please check email to verify!`
        })
    } catch (error) {
        res.status(error.status).json({
            data: {},
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    signUp
}