const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Don't return password by default in queries
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    // Only hash password if it's been modified (or is new)
    if (!this.isModified("password")) return;

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Mongoose automatically uses "users" collection (pluralized, lowercased model name)
// This will use: userdb database -> users collection
module.exports = mongoose.model("User", userSchema);

