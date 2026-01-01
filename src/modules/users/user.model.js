const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            unique: true,
            sparse: true, // Allow null values but enforce uniqueness when present
        },
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
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
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Don't return password by default in queries
        },
        role: {
            type: String,
            enum: ["ADMIN", "EMPLOYEE", "MANAGER"],
            default: "EMPLOYEE",
            required: true,
        },
        designation: {
            type: String,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        currentProject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
        pastProjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        dateOfJoining: {
            type: Date,
        },
        totalExperience: {
            type: Number, // in years
            min: 0,
        },
        location: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFirstLogin: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
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

// Virtual for full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set("toJSON", { virtuals: true });

// Mongoose automatically uses "users" collection (pluralized, lowercased model name)
// This will use: userdb database -> users collection
module.exports = mongoose.model("User", userSchema);

