/**
 * Seed Script: Create First Admin User
 * 
 * This script creates the first admin user in the database.
 * Run this script once to set up your initial admin account.
 * 
 * Usage: node scripts/seed-admin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/modules/users/user.model");
const { generateEmployeeId } = require("../src/utils/generators");
const config = require("../src/config/env");
const connectDB = require("../src/config/db");

// Admin user data
const adminData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "temporary123",
    phone: "+1234567890",
    role: "ADMIN",
    designation: "System Administrator",
    department: "IT",
    skills: ["System Administration", "Node.js", "MongoDB"],
    dateOfJoining: new Date("2025-01-15"),
    totalExperience: 5,
    location: "New York",
    isActive: true,
    isFirstLogin: true,
};

async function seedAdmin() {
    try {
        console.log("🌱 Starting admin user seed...");

        // Connect to MongoDB
        await connectDB();
        console.log("✅ Connected to MongoDB");

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists with email:", adminData.email);
            console.log("   Employee ID:", existingAdmin.employeeId);
            console.log("   Role:", existingAdmin.role);
            process.exit(0);
        }

        // Check if any admin exists
        const existingAdmins = await User.find({ role: "ADMIN" });
        if (existingAdmins.length > 0) {
            console.log("⚠️  Admin users already exist in the database:");
            existingAdmins.forEach((admin) => {
                console.log(`   - ${admin.email} (${admin.employeeId})`);
            });
            console.log("\n   If you want to create another admin, use the API endpoint after logging in.");
            process.exit(0);
        }

        // Generate employeeId
        adminData.employeeId = await generateEmployeeId();
        console.log("✅ Generated Employee ID:", adminData.employeeId);

        // Create admin user (password will be hashed by pre-save hook)
        const admin = await User.create(adminData);
        console.log("✅ Admin user created successfully!");

        console.log("\n📋 Admin User Details:");
        console.log("   Employee ID:", admin.employeeId);
        console.log("   Name:", admin.firstName, admin.lastName);
        console.log("   Email:", admin.email);
        console.log("   Role:", admin.role);
        console.log("   Password:", adminData.password, "(change this after first login)");
        console.log("\n🔐 Next Steps:");
        console.log("   1. Login with the credentials above");
        console.log("   2. Change your password using /api/auth/change-password");
        console.log("   3. Start creating other users via /api/admin/users");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin user:", error.message);
        if (error.code === 11000) {
            console.error("   Duplicate key error - user with this email may already exist");
        }
        process.exit(1);
    }
}

// Run the seed function
seedAdmin();

