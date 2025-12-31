const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Connection string format: mongodb://host:port/database
        // This connects to the 'userdb' database
        // Collections (like 'users') are created automatically when first document is inserted
        const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/userdb");
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

