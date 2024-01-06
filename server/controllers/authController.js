const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/tokenService");

const { User, registrationValidationSchema, loginValidationSchema } = require('../models/user');


module.exports = {
    register: async (req, res) => {
        try {
            console.log("body", req.body);
            let { name, email, password, isAdmin } = req.body;
            const { error } = registrationValidationSchema.validate({ name, email, password, is_admin: isAdmin });
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: { error: error?.details[0]?.message }
                });
            }
            let existingUser = await User.findOne({
                email: email
            });
            if (existingUser) {
                return res.status(401).json({
                    success: false,
                    error: 'Email already registered'
                })
            }
            let hashedPassword = await bcrypt.hash(password, 7);
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                is_admin: isAdmin || false,
            });
            await newUser.save();
            res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            })
        }
    },
    login: async (req, res) => {
        try {
            let { email, password } = req.body;
            const { error } = loginValidationSchema.validate({ email, password });
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: { error: error?.details[0]?.message }
                });
            }
            const user = await User.findOne({ email });
            if (user && (await bcrypt.compare(password, user.password))) {
                let token = await generateToken({ userId: user._id });
                user.password = undefined;

                return res.status(200).json({
                    success: true,
                    message: "Login successful",
                    user, token
                })
            }
            res.status(401).json({
                success: false,
                error: "Invalid credentials"
            })
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            })
        }
    }
}