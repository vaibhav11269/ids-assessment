const jwt = require("jsonwebtoken");
const config = require("./tokenConfig")
const JwtSecret = process.env.JWT_SECRET;

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token.startsWith("Bearer"))
            return reject(new Error("Invalid Token"));
        const toeknVal = token.slice(7, token.length).trim();
        let options = {
            maxAge: config.JWT_TOEKN_MAXAGE,
            algorithms: config.JWT_TOKEN_ALGORITHM
        };
        return jwt.verify(toeknVal, JwtSecret, options, (err, decodedToken) => {
            if (err) return reject(err);
            if (!decodedToken) return reject(new Error("Invalid Token"));
            return resolve(decodedToken)
        })
    })
}

module.exports = verifyToken;