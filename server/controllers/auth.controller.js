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
    try {
        const data = await AuthServiceInstance.ChangePassword(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: true, message: error.message })
    }
}

module.exports = {
    signUp,
    verifyAccount,
    login,
    forgotPassword,
    resetPassword
}