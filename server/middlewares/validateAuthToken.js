const { verifyToken } = require("../services/tokenService");

const validateAuthToken = (req, res, next) => {
    const token = req.get("Authorization");
    if (!token) return res.status(401).json({ message: "Token is Invalid" });
    return verifyToken(token)
        .then((data) => {
            // console.log("Token dtaa", data)
            req.userId = data.userId;
            next();
        })
        .catch(err => res.status(401).json({ message: "Invalid Toekn", error: err }))
}

module.exports = validateAuthToken;