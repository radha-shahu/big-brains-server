const User = require("../users/user.model");
const { BadRequestError, UnauthorizedError } = require("../../utils/errors");
const { generateToken } = require("../../utils/jwt");
const { userDTO } = require("../users/user.dto");

// Register new user
const register = async (userData) => {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError("User with this email already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    return {
        user: userDTO(user),
        token,
    };
};

// Login user
const login = async (email, password) => {
    // Find user and include password (since it's select: false by default)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
        throw new UnauthorizedError("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return {
        user: userDTO(user),
        token,
    };
};

// Get current user
const getMe = (user) => {
    return userDTO(user);
};

module.exports = {
    register,
    login,
    getMe,
};

