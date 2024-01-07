const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validateAuthToken = require("../middlewares/validateAuthToken");

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);
router.put("/logoutTime", validateAuthToken, authController.updateLogoutTime);


module.exports = router;