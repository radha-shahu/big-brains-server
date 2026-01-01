const Project = require("./project.model");
const { NotFoundError } = require("../../utils/errors");
const { projectDTO, projectListDTO } = require("./project.dto");

// Get all projects (read-only for employees)
const getAllProjects = async (filters = {}) => {
    const { status, search } = filters;
    const query = {};

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { projectCode: { $regex: search, $options: "i" } },
            { clientName: { $regex: search, $options: "i" } },
        ];
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return projectListDTO(projects);
};

// Get project by ID
const getProjectById = async (projectId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    return projectDTO(project);
};

module.exports = {
    getAllProjects,
    getProjectById,
};

