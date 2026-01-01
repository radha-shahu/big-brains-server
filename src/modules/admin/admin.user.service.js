const mongoose = require("mongoose");
const User = require("../users/user.model");
const Project = require("../projects/project.model");
const { NotFoundError, ConflictError, BadRequestError, ERROR_CODES } = require("../../utils/errors");
const { generateEmployeeId } = require("../../utils/generators");
const { userDTO, userListDTO } = require("../users/user.dto");

// Helper function to resolve manager ID (employeeId or ObjectId) to ObjectId
const resolveManagerId = async (managerId) => {
    if (!managerId) return null;
    
    // Check if it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(managerId) && managerId.length === 24) {
        // Validate that the user exists
        const manager = await User.findById(managerId);
        if (!manager) {
            throw new NotFoundError(`Manager with ID "${managerId}" not found`);
        }
        return managerId;
    } else {
        // It's an employeeId, find the user and return their _id
        const manager = await User.findOne({ employeeId: managerId });
        if (!manager) {
            throw new NotFoundError(`Manager with employeeId "${managerId}" not found`);
        }
        return manager._id;
    }
};

// Helper function to resolve project ID (projectCode or ObjectId) to ObjectId
const resolveProjectId = async (projectId) => {
    if (!projectId) return null;
    
    // Check if it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(projectId) && projectId.length === 24) {
        // Validate that the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            throw new NotFoundError(`Project with ID "${projectId}" not found`);
        }
        return projectId;
    } else {
        // It's a projectCode, find the project and return its _id
        const project = await Project.findOne({ projectCode: projectId });
        if (!project) {
            throw new NotFoundError(`Project with projectCode "${projectId}" not found`);
        }
        return project._id;
    }
};

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

    // Resolve manager ID if provided
    const resolvedManagerId = manager ? await resolveManagerId(manager) : null;
    
    // Resolve currentProject ID if provided
    const resolvedCurrentProjectId = currentProject ? await resolveProjectId(currentProject) : null;

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
        manager: resolvedManagerId,
        currentProject: resolvedCurrentProjectId,
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
// Supports both MongoDB _id and employeeId
const getUserById = async (userId) => {
    let user;
    
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(userId) && userId.length === 24) {
        // Query by MongoDB _id
        user = await User.findById(userId)
            .populate("manager", "firstName lastName email employeeId")
            .populate("currentProject", "name projectCode")
            .populate("pastProjects", "name projectCode");
    } else {
        // Query by employeeId (e.g., EMP-2025-0001)
        user = await User.findOne({ employeeId: userId })
            .populate("manager", "firstName lastName email employeeId")
            .populate("currentProject", "name projectCode")
            .populate("pastProjects", "name projectCode");
    }

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

// Update user (Admin only)
// Supports both MongoDB _id and employeeId
const updateUser = async (userId, updateData) => {
    let user;
    let query;
    
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(userId) && userId.length === 24) {
        query = { _id: userId };
    } else {
        query = { employeeId: userId };
    }
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

    // Resolve manager ID if provided
    if (updateData.manager !== undefined) {
        if (updateData.manager === null) {
            // Allow setting manager to null
            filteredData.manager = null;
        } else {
            filteredData.manager = await resolveManagerId(updateData.manager);
        }
    }

    // Resolve currentProject ID if provided
    if (updateData.currentProject !== undefined) {
        if (updateData.currentProject === null) {
            // Allow setting currentProject to null
            filteredData.currentProject = null;
        } else {
            filteredData.currentProject = await resolveProjectId(updateData.currentProject);
        }
    }

    // Handle pastProjects - if provided, resolve IDs and append to existing array
    if (updateData.pastProjects && Array.isArray(updateData.pastProjects)) {
        user = await User.findOne(query);
        if (user) {
            // Resolve all project IDs to ObjectIds
            const resolvedProjectIds = await Promise.all(
                updateData.pastProjects.map((projectId) => resolveProjectId(projectId))
            );
            
            // Merge with existing pastProjects, avoiding duplicates
            const existingProjects = (user.pastProjects || []).map((id) => id.toString());
            const newProjects = resolvedProjectIds.filter(
                (p) => !existingProjects.includes(p.toString())
            );
            filteredData.pastProjects = [...user.pastProjects, ...newProjects];
        }
    }

    user = await User.findOneAndUpdate(query, filteredData, {
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
// Supports both MongoDB _id and employeeId
const updateUserStatus = async (userId, isActive) => {
    let query;
    
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(userId) && userId.length === 24) {
        query = { _id: userId };
    } else {
        query = { employeeId: userId };
    }
    
    const user = await User.findOneAndUpdate(
        query,
        { isActive },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

// Reset user password (Admin only)
// Supports both MongoDB _id and employeeId
const resetPassword = async (userId, newPassword) => {
    let user;
    
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(userId) && userId.length === 24) {
        user = await User.findById(userId).select("+password");
    } else {
        user = await User.findOne({ employeeId: userId }).select("+password");
    }

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

