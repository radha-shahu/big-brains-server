const User = require("./user.model");
const { NotFoundError, ConflictError, ForbiddenError, ERROR_CODES } = require("../../utils/errors");
const { userDTO, userListDTO } = require("./user.dto");

// Get all users (for employee directory - read-only, limited info)
const getAllUsers = async () => {
    const users = await User.find({ isActive: true })
        .select("firstName lastName email employeeId designation department currentProject")
        .populate("currentProject", "name projectCode")
        .sort({ firstName: 1 });

    return userListDTO(users);
};

// Get user by ID
const getUserById = async (userId) => {
    const user = await User.findById(userId)
        .populate("manager", "firstName lastName email employeeId")
        .populate("currentProject", "name projectCode")
        .populate("pastProjects", "name projectCode");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

// Get own profile
const getMyProfile = async (userId) => {
    const user = await User.findById(userId)
        .populate("manager", "firstName lastName email employeeId")
        .populate("currentProject", "name projectCode")
        .populate("pastProjects", "name projectCode");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

// Update own profile (restricted fields only)
const updateMyProfile = async (userId, updateData) => {
    // Only allow updating these fields
    const allowedFields = ["firstName", "lastName", "email", "phone", "skills"];

    // Filter out fields that are not allowed
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    });

    // Check if email is being updated and if it's already taken
    if (filteredData.email) {
        const existingUser = await User.findOne({ email: filteredData.email });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new ConflictError("Email is already taken");
        }
    }

    const user = await User.findByIdAndUpdate(userId, filteredData, {
        new: true,
        runValidators: true,
    })
        .populate("manager", "firstName lastName email employeeId")
        .populate("currentProject", "name projectCode")
        .populate("pastProjects", "name projectCode");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

module.exports = {
    getAllUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
};
