const sendEmail = require("../helper/mailer");
const userModel = require("../models/auth.model")
const bcrypt = require("../helper/bcrypt");

const { jwtTokenVerification, createJwtToken } = require("../helper/jwt")
const { VERIFICATION_SECRET_KEY, FRONTENT_URL } = process.env

class AuthService {

    async SignUp(body) {
        const { email } = body;
        try {
            const isExist = await userModel.findOne({ email: email.trim() })
            if (isExist) {
                return { status: 400, message: `User already exist with this ${email}` }
            }
            let verificationToken = createJwtToken(body, VERIFICATION_SECRET_KEY, "10m")

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
    };

    async AccountActivation(body) {
        const { verificationToken } = body
        try {
            const decoded = jwtTokenVerification(verificationToken, VERIFICATION_SECRET_KEY);

            if (!decoded) {
                return { status: 400, message: `Token has been expired or Invalid!` }
            }
            const { name, email, password } = decoded;

            let hashedPassword = await bcrypt.hashPassword(password)

            const isUserExist = await userModel.findOne({ "email": email.trim() }).exec()
            if (isUserExist) {
                return { status: 400, message: `Account can not be activate with this ${email}, it's already exist.` }
            }
            await userModel.create({ name, email, password: hashedPassword });
            return { status: 200, message: `Account has been activated successfully!` }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }

}

module.exports = AuthService