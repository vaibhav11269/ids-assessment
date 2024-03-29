const moment = require("moment");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const csv = require("fast-csv");
const { User } = require('../models/user');
const UserSession = require("../models/userSession");



module.exports = {
    activeUsersCount: async (req, res) => {
        try {
            const currentDate = new Date();
            const startOfDay = moment(currentDate).startOf('day').toDate();
            const endOfDay = moment(currentDate).endOf('day').toDate();
            const dailyActiveUsers = await UserSession.aggregate([
                {
                    $match: {
                        loginTime: { $gte: startOfDay, $lte: endOfDay },
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);

            const startOfWeek = moment(currentDate).startOf('isoWeek').toDate();
            const endOfWeek = moment(currentDate).endOf('isoWeek').toDate();
            const weeklyActiveUsers = await UserSession.aggregate([
                {
                    $match: {
                        loginTime: { $gte: startOfWeek, $lte: endOfWeek },
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);

            const startOfMonth = moment(currentDate).startOf('month').toDate();
            const endOfMonth = moment(currentDate).endOf('month').toDate();
            const monthlyActiveUsers = await UserSession.aggregate([
                {
                    $match: {
                        loginTime: { $gte: startOfMonth, $lte: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);

            return res.status(200).json({
                daily: dailyActiveUsers.length > 0 ? dailyActiveUsers[0].count : 0,
                weekly: weeklyActiveUsers.length > 0 ? weeklyActiveUsers[0].count : 0,
                monthly: monthlyActiveUsers.length > 0 ? monthlyActiveUsers[0].count : 0,
            });
        } catch (error) {
            console.error('Error fetching active users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    topUsersByUsageTime: async (req, res) => {
        try {
            const topUsers = await UserSession.aggregate([
                {
                    $group: {
                        _id: '$userId',
                        totalUsageTime: { $sum: '$usageTime' },
                    },
                },
                {
                    $sort: { totalUsageTime: -1 },
                },
                {
                    $limit: 15,
                },
            ]);

            const populatedTopUsers = await UserSession.populate(topUsers, { path: '_id', model: 'User' });
            const formattedTopUsers = populatedTopUsers.map((user) => ({
                userId: user._id._id,
                userName: user._id.name,
                email: user._id.email,
                totalUsageTime: user.totalUsageTime,
            }));

            return res.status(200).json({
                success: true,
                formattedTopUsers
            });
        } catch (error) {
            console.error('Error fetching top users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getUserActivity: async (req, res) => {
        try {
            const userId = req.userId;
            const userActivities = await UserSession.find({ userId });
            const formattedUserActivities = userActivities.map((activity) => ({
                userId: activity.userId,
                loginTime: activity.loginTime,
                logoutTime: activity.logoutTime,
                usageTime: activity.usageTime,
            }));

            return res.status(200).json({ formattedUserActivities });
        } catch (error) {
            console.error('Error fetching user activities:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    fetchAllUsers: async (req, res) => {
        try {
            const first15Users = await User.find().limit(15);
            return res.status(200).json({ users: first15Users });
        } catch (error) {
            console.error('Error fetching the first 15 users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    filterUsers: async (req, res) => {
        try {
            const { gender, country, device } = req.body;
            const filter = {};
            if (gender) filter.gender = gender;
            if (country) filter.country = { $regex: new RegExp(country, 'i') };
            if (device) filter.device = { $regex: new RegExp(device, 'i') };
            const users = await User.find(filter).limit(15);

            return res.status(200).json({ users });
        } catch (error) {
            console.error('Error fetching top users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    uploadUsers: async (req, res) => {
        try {
            let currentPath = path.dirname(__dirname) + "/uploads/" + req.file.filename;
            let stream = fs.createReadStream(currentPath);
            let csvData = [];
            let hashedPassword = await bcrypt.hash("password", 7);
            let fileStream = csv.parse()
                .on('error', error => console.log(error))
                .on('data', row => {
                    if (row.length > 0) csvData.push(row);
                })
                .on('end', async () => {
                    csvData.shift();
                    let results = [];
                    for (const row of csvData) {
                        const newUser = new User({
                            name: row[0],
                            email: row[1],
                            password: hashedPassword,
                            is_admin: false,
                            gender: row[2],
                            country: row[3],
                            device: row[4]
                        });
                        await newUser.save();
                        results.push({
                            userId: newUser._id,
                            status: true,
                            message: "Record Created"
                        });
                    }
                    fs.unlinkSync(currentPath);
                    return res.status(201).json({
                        success: true,
                        message: "All Records Inserted",
                        results
                    });
                });
            stream.pipe(fileStream);
        } catch (error) {
            console.error('Error fetching top users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    filterTopUsers: async (req, res) => {
        try {
            const { gender, country, device } = req.body;
            const filter = {};
            if (gender) filter.gender = gender;
            if (country) filter.country = country;
            if (device) filter.device = device;
            const topUsers = await User.aggregate([
                {
                    $match: filter,
                },
                {
                    $lookup: {
                        from: 'usersessions',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'sessions',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        totalUsageTime: { $sum: { $ifNull: ['$sessions.usageTime', 0] } },
                        userName: { $first: '$name' },
                        email: { $first: '$email' },
                    },
                },
                {
                    $sort: { totalUsageTime: -1 },
                },
                {
                    $limit: 15,
                },
            ]);

            return res.status(200).json({
                success: true,
                topUsers,
            });
        } catch (error) {
            console.error('Error fetching top users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}