const mongoose = require("mongoose");
const Joi = require('joi');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
})

const User = mongoose.model('User', userSchema);

const registrationValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    is_admin: Joi.boolean(),
});

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

module.exports = { User, registrationValidationSchema, loginValidationSchema };