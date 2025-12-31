require("dotenv").config();

const config = {
    // Server Configuration
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",

    // MongoDB Configuration
    mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userdb",

    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = config;

