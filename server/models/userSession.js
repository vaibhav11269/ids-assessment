const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    loginTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    logoutTime: {
        type: Date,
    },
    usageTime: {
        type: Number,
    },
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
