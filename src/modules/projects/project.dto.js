// Data Transfer Objects for Project
// Used to shape data for API responses

const projectDTO = (project) => {
    const projectId = project._id ? project._id.toString() : (project.id ? project.id.toString() : null);

    return {
        id: projectId,
        projectCode: project.projectCode,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        clientName: project.clientName,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
};

const projectListDTO = (projects) => {
    return projects.map((project) => projectDTO(project));
};

module.exports = {
    projectDTO,
    projectListDTO,
};

