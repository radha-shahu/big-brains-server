const User = require("./user.model");
const { NotFoundError, ConflictError } = require("../../utils/errors");
const { userDTO, userListDTO } = require("./user.dto");

// Get all users
const getAllUsers = async () => {
    const users = await User.find().sort({ createdAt: -1 });
    return userListDTO(users);
};

// Get user by ID
const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return userDTO(user);
};

// Create user
const createUser = async (userData) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    const user = await User.create(userData);
    return userDTO(user);
};

// Update user
const updateUser = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return userDTO(user);
};

// Delete user
const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return null;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};

