const sendEmail = require("../helper/mailer");
const userModel = require("../models/auth.model")
const bcrypt = require("../helper/bcrypt")
const AuthService = require("../services/auth-service")
// Service Instance
const AuthServiceInstance = new AuthService();

const signUp = async (req, res) => {
    try {
        const data = await AuthServiceInstance.SignUp(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: true, message: error.message })
    }
}

const verifyAccount = async (req, res) => {
    try {
        const data = await AuthServiceInstance.AccountActivation(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const response = await AuthServiceInstance.SignIn(req.body);
        res.status(response.status).json({  status: true, message: response.message, data: response.data })
    } catch (error) {
        res.status(error.status).json({  status: false, message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const data = await AuthServiceInstance.ForgotPassword(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: true, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    const { token, password, confirm_password } = req.body;

    try {
        await jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: `Token has been expired or Invalid!`,
                })
            }

            if (password != confirm_password) {
                return res.status(400).json({
                    status: false,
                    message: `Password and Confirm Password are not matched, Please try again`,
                })
            }
            const newHashedPassword = await bcrypt.hashPassword(password);

            await userModel.updateOne({ _id: decodedToken.id }, { $set: { password: newHashedPassword } });
            res.status(200).json({
                status: true,
                message: `Password has been changed successfully!`,
            })
        })
    } catch (error) {
        res.status(error.status || 500).json({
            status: false,
            message: error.message,
        })
    }
}

module.exports = {
    signUp,
    verifyAccount,
    login,
    forgotPassword,
    resetPassword
}