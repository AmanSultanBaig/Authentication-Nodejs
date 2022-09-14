const sendEmail = require("../helper/mailer");
const jwt = require("jsonwebtoken")
const userModel = require("../models/auth.model")
const bcrypt = require("../helper/bcrypt");

const { VERIFICATION_SECRET_KEY, FRONTENT_URL } = process.env

class AuthService {

    async SignUp(body) {
        const { email } = body;
        try {
            const isExist = await userModel.findOne({ email: email.trim() })
            if (isExist) {
                return res.status(400).json({
                    status: false,
                    message: `User already exist with this ${email}`,
                })
            }
            let verificationToken = jwt.sign(body, VERIFICATION_SECRET_KEY, { expiresIn: "10m" })

            let mailObject = {
                from: process.env.MAIL_ACCOUNT_EMAIL,
                to: email,
                subject: 'Account Activation',
                html: `<p>Please click to given link below to verify your account!</p>
                <a href='${FRONTENT_URL}/verify/${verificationToken}'>Verify Account Now!<a/>
                `
            }
            await sendEmail(mailObject, "html")
            return { status: 200, message: "Account has been created! Please check email to verify!" }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }

}

module.exports = AuthService