const mongoose = require("mongoose");
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
// Supports both MongoDB _id and projectCode
const getProjectById = async (projectId) => {
    let project;
    
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(projectId) && projectId.length === 24) {
        // Query by MongoDB _id
        project = await Project.findById(projectId);
    } else {
        // Query by projectCode (e.g., PROJ-CRM-001)
        project = await Project.findOne({ projectCode: projectId });
    }

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    return projectDTO(project);
};

module.exports = {
    getAllProjects,
    getProjectById,
};

