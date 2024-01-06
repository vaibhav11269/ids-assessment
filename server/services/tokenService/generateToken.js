const jwt = require("jsonwebtoken");
const config = require("./tokenConfig")
const JwtSecret = process.env.JWT_SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, JwtSecret, {
        expiresIn: config.JWT_TOEKN_MAXAGE,
        algorithm: config.JWT_TOKEN_ALGORITHM
    })
}

module.exports = generateToken;