const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        projectCode: {
            type: String,
            unique: true,
            sparse: true, // Allow null values but enforce uniqueness when present
        },
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE", "COMPLETED", "ON_HOLD"],
            default: "ACTIVE",
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        clientName: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Mongoose automatically uses "projects" collection
module.exports = mongoose.model("Project", projectSchema);

