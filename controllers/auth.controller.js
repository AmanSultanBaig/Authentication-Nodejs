const sendEmail = require("../helper/mailer");
const jwt = require("jsonwebtoken")
const userModel = require("../models/auth.model")
const bcrypt = require("../helper/bcrypt")

const signUp = async (req, res) => {
    const { email } = req.body;
    try {
        const isExist = await userModel.findOne({ email: email.trim() })
        if (isExist) {
            return res.status(400).json({
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

const verifyAccount = async (req, res) => {
    const { verificationToken } = req.body
    try {
        jwt.verify(verificationToken, process.env.VERIFICATION_SECRET_KEY, async (err, decode) => {
            if (err) {
                return res.status(400).json({
                    data: {},
                    status: false,
                    message: `Token has been expired or Invalid!`
                })
            }
            const { name, email, password } = decode;

            let hashedPassword = await bcrypt.hashPassword(password)

            const isUserExist = await userModel.findOne({ email: email.trim() })
            if(isUserExist) {
                return res.status(400).json({
                    data: {},
                    status: false,
                    message: `Account can not be activate with this ${email}, it's already exist.`
                })
            }
            await userModel.create({ name, email, password: hashedPassword });
            res.status(200).json({
                data: {},
                status: true,
                message: `Account has been activated successfully!`
            })
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
    signUp,
    verifyAccount
}