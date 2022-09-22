const UserService = require("../services/user-service")
// Service Instance
const UserServiceInstance = new UserService();

const signUp = async (req, res) => {
    try {
        const data = await UserServiceInstance.SignUp(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: true, message: error.message })
    }
}

const verifyAccount = async (req, res) => {
    try {
        const data = await UserServiceInstance.AccountActivation(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const response = await UserServiceInstance.SignIn(req.body);
        res.status(response.status).json({  status: true, message: response.message, data: response.data })
    } catch (error) {
        res.status(error.status).json({  status: false, message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const data = await UserServiceInstance.ForgotPassword(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: true, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const data = await UserServiceInstance.ChangePassword(req.body);
        res.status(data.status).json({  status: true, message: data.message })
    } catch (error) {
        res.status(error.status).json({  status: true, message: error.message })
    }
}

const getUserAccess = (req, res) => {
    res.status(200).json({
        status: true, 
        message: "I Have accessed this route"
    })
}

module.exports = {
    signUp,
    verifyAccount,
    login,
    forgotPassword,
    resetPassword,
    getUserAccess
}