const bcrypt = require("bcryptjs");

// Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

// Compare password
const comparePassword = async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};

