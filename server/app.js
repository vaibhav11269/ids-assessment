require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const database = require("./config/database");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();


mongoose.connect(database.mongoURI)
    .then(() => {
        console.log('MongoDB Connected');

        app.use(cors());
        app.use(express.json());

        app.use("/api/auth", authRouter);
        app.use("/api/users", userRouter);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));