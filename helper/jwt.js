const jwt = require("jsonwebtoken");

const jwtTokenVerification = (token, signature) => {
    try {
        const payload = jwt.verify(token, signature);
        return payload;
    } catch (err) {
        return false;
    }
}

const createJwtToken = (payload, signature, expires_within) => {
    try {
        const token = jwt.sign(payload, signature, { expiresIn: expires_within })
        return token;
    } catch (err) {
        return false;
    }
}



module.exports = {
    jwtTokenVerification,
    createJwtToken
}