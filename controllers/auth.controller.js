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
                status: false,
                message: `User already exist with this ${email}`,
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
            status: true,
            message: `Account has been created! Please check email to verify!`,
        })
    } catch (error) {
        res.status(error.status || 500).json({
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
                    status: false,
                    message: `Token has been expired or Invalid!`,
                })
            }
            const { name, email, password } = decode;

            let hashedPassword = await bcrypt.hashPassword(password)

            const isUserExist = await userModel.findOne({ email: email.trim() })
            if (isUserExist) {
                return res.status(400).json({
                    status: false,
                    message: `Account can not be activate with this ${email}, it's already exist.`,
                })
            }
            await userModel.create({ name, email, password: hashedPassword });
            res.status(200).json({
                status: true,
                message: `Account has been activated successfully!`,
            })
        })
    } catch (error) {
        res.status(error.status || 500).json({
            status: false,
            message: error.message
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUserExist = await userModel.findOne({ email: email.trim() });

        if (!isUserExist) {
            return res.status(404).json({
                status: false,
                message: `No such user found with ${email}`
            })
        }
        const isCredentialsValid = await bcrypt.comparePassword(password, isUserExist.password);

        if (!isCredentialsValid) {
            return res.status(400).json({
                status: false,
                message: `Invalid email or password, please try again with valid credentials!`
            })
        }

        const accessToken = await jwt.sign({ id: isUserExist._id }, process.env.LOGIN_SECRET_KEY, { expiresIn: "7d" });

        res.status(200).json({
            status: true,
            message: `Logged-in successfully!`,
            data: { token: accessToken, user: { email: isUserExist.email, name: isUserExist.name, id: isUserExist._id } },
        })
    } catch (error) {
        res.status(error.status || 500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    signUp,
    verifyAccount,
    login
}