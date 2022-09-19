const { jwtTokenVerification } = require("../helper/jwt")
const { LOGIN_SECRET_KEY } = process.env
const UserModel = require("../models/auth.model")

const authenticateUser = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ status: false, message: "Token required" })
    }

    const token = authorization.split(" ")[1]; // get token only skip "bearer"
    const decodeToken = jwtTokenVerification(token, LOGIN_SECRET_KEY); // verify token given by user

    if (!decodeToken) {
        return res.status(401).json({ status: false, message: "Invalid or token expired, Please login again!" })
    }

    const userFound = await UserModel.findOne({ _id: decodeToken.id })
    if (!userFound) {
        return res.status(404).json({ status: false, message: "Invalid user request to login" })
    }

    next()
}

module.exports = {
    authenticateUser
}