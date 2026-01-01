// Data Transfer Objects for User
// Used to shape data for API responses

const userDTO = (user) => {
    // Handle both _id (from DB) and id (from transformed responses)
    const userId = user._id ? user._id.toString() : (user.id ? user.id.toString() : null);

    // Handle populated fields
    const manager = user.manager
        ? {
              id: user.manager._id ? user.manager._id.toString() : user.manager.id,
              firstName: user.manager.firstName,
              lastName: user.manager.lastName,
              email: user.manager.email,
              employeeId: user.manager.employeeId,
          }
        : null;

    const currentProject = user.currentProject
        ? {
              id: user.currentProject._id ? user.currentProject._id.toString() : user.currentProject.id,
              name: user.currentProject.name,
              projectCode: user.currentProject.projectCode,
          }
        : null;

    const pastProjects = user.pastProjects
        ? user.pastProjects.map((project) => ({
              id: project._id ? project._id.toString() : project.id,
              name: project.name,
              projectCode: project.projectCode,
          }))
        : [];

    return {
        id: userId,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        role: user.role,
        designation: user.designation,
        department: user.department,
        manager,
        currentProject,
        pastProjects,
        skills: user.skills || [],
        dateOfJoining: user.dateOfJoining,
        totalExperience: user.totalExperience,
        location: user.location,
        isActive: user.isActive,
        isFirstLogin: user.isFirstLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const userListDTO = (users) => {
    return users.map((user) => userDTO(user));
};

module.exports = {
    userDTO,
    userListDTO,
};

