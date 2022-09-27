const bcrypt = require("bcrypt")

const hashPassword = async (password) => {
    const salt = 10
    let hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

const comparePassword = async (password, hashedPassword) => {
    let isPasswordMatched = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatched
}

module.exports = {
    hashPassword,
    comparePassword
}