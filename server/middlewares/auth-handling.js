const { jwtTokenVerification } = require("../utils/jwt")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../.env') })
const { LOGIN_SECRET_KEY } = process.env

const UserModel = require("../db/models/user.model")
const RoleModel = require("../db/models/roles.model")

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

    const userFound = await UserModel.findOne({ "email": decodeToken.email })
    if (!userFound) {
        return res.status(404).json({ status: false, message: "Invalid user request to login" })
    }

    next()
}

const authorizedUser = async (req, res, next) => {
    const { authorization } = req.headers

    const pipeline = [{
        $group: {
            _id: "null",
            name: { "$push": "$name" }
        },
    },
    { $project: { "name": 1, _id: 0 } }]

    let roles = await RoleModel.aggregate(pipeline)

    !roles.length ? roles = ["user"] : roles = roles[0].name

    if (!authorization) {
        return res.status(401).json({ status: false, message: "Token required" })
    }

    const token = authorization.split(" ")[1]; // get token only skip "bearer"
    const decodeToken = jwtTokenVerification(token, LOGIN_SECRET_KEY); // verify token given by user

    if (!decodeToken) {
        return res.status(401).json({ status: false, message: "Invalid or token expired, Please login again!" })
    }

    const userFound = await UserModel.findOne({ "email": decodeToken.email })
    if (!userFound) {
        return res.status(404).json({ status: false, message: "Invalid user request to login" })
    }

    if (!roles.includes(userFound.role)) {
        return res.status(401).json({ status: false, message: "You don't have access to this api" })
    }

    next()
}

module.exports = {
    authenticateUser,
    authorizedUser
}