// Data Transfer Objects for User
// Used to shape data for API responses

const userDTO = (user) => {
    // Handle both _id (from DB) and id (from transformed responses)
    const userId = user._id ? user._id.toString() : (user.id ? user.id.toString() : null);
    
    return {
        id: userId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const userListDTO = (users) => {
    return users.map(user => userDTO(user));
};

module.exports = {
    userDTO,
    userListDTO,
};

