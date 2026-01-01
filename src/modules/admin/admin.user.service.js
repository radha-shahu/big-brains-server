const User = require("../users/user.model");
const { NotFoundError, ConflictError, BadRequestError, ERROR_CODES } = require("../../utils/errors");
const { generateEmployeeId } = require("../../utils/generators");
const { userDTO, userListDTO } = require("../users/user.dto");

// Create new user (Admin only)
const createUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        designation,
        department,
        manager,
        currentProject,
        skills,
        dateOfJoining,
        totalExperience,
        location,
    } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    // Generate employeeId
    const employeeId = await generateEmployeeId();

    // Create user
    const user = await User.create({
        employeeId,
        firstName,
        lastName,
        email,
        password, // Will be hashed by pre-save hook
        phone,
        role: role || "EMPLOYEE",
        designation,
        department,
        manager,
        currentProject,
        skills: skills || [],
        dateOfJoining,
        totalExperience,
        location,
        isActive: true,
        isFirstLogin: true,
    });

    return userDTO(user);
};

// Get all users (Admin only)
const getAllUsers = async (filters = {}) => {
    const { role, isActive, search } = filters;
    const query = {};

    if (role) {
        query.role = role;
    }

    if (isActive !== undefined) {
        query.isActive = isActive === "true" || isActive === true;
    }

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { employeeId: { $regex: search, $options: "i" } },
        ];
    }

    const users = await User.find(query)
        .populate("manager", "firstName lastName email employeeId")
        .populate("currentProject", "name projectCode")
        .sort({ createdAt: -1 });

    return userListDTO(users);
};

// Get user by ID (Admin only)
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

// Update user (Admin only)
const updateUser = async (userId, updateData) => {
    const allowedFields = [
        "role",
        "designation",
        "department",
        "manager",
        "currentProject",
        "pastProjects",
        "dateOfJoining",
        "totalExperience",
        "location",
        "isActive",
    ];

    // Filter out fields that are not allowed
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    });

    // Handle pastProjects - if provided, append to existing array
    if (updateData.pastProjects && Array.isArray(updateData.pastProjects)) {
        const user = await User.findById(userId);
        if (user) {
            // Merge with existing pastProjects, avoiding duplicates
            const existingProjects = user.pastProjects || [];
            const newProjects = updateData.pastProjects.filter(
                (p) => !existingProjects.includes(p)
            );
            filteredData.pastProjects = [...existingProjects, ...newProjects];
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

// Update user status (enable/disable)
const updateUserStatus = async (userId, isActive) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

// Reset user password (Admin only)
const resetPassword = async (userId, newPassword) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    user.password = newPassword;
    user.isFirstLogin = true; // Force password change on next login
    await user.save();

    return {
        message: "Password reset successfully",
    };
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    resetPassword,
};

