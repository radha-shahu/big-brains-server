const mongoose = require("mongoose");
const Project = require("../projects/project.model");
const { NotFoundError, ConflictError } = require("../../utils/errors");
const { generateProjectCode } = require("../../utils/generators");
const { projectDTO, projectListDTO } = require("../projects/project.dto");

// Create new project (Admin only)
const createProject = async (projectData) => {
    const { name, description, status, startDate, endDate, clientName } = projectData;

    // Check if project with same name already exists
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
        throw new ConflictError("Project with this name already exists");
    }

    // Generate projectCode
    const projectCode = await generateProjectCode(name);

    // Create project
    const project = await Project.create({
        projectCode,
        name,
        description,
        status: status || "ACTIVE",
        startDate,
        endDate,
        clientName,
    });

    return projectDTO(project);
};

// Get all projects
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

// Update project (Admin only)
// Supports both MongoDB _id and projectCode
const updateProject = async (projectId, updateData) => {
    let query;
    
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(projectId) && projectId.length === 24) {
        query = { _id: projectId };
    } else {
        query = { projectCode: projectId };
    }
    
    const allowedFields = ["name", "description", "status", "startDate", "endDate", "clientName"];

    // Filter out fields that are not allowed
    const filteredData = {};
    Object.keys(updateData).forEach((key) => {
        if (allowedFields.includes(key)) {
            filteredData[key] = updateData[key];
        }
    });

    const project = await Project.findOneAndUpdate(query, filteredData, {
        new: true,
        runValidators: true,
    });

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    return projectDTO(project);
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
};

