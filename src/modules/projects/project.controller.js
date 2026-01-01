const mongoose = require("mongoose");
const projectService = require("./project.service");
const { asyncHandler } = require("../../middlewares/error.middleware");
const adminProjectValidation = require("../admin/admin.project.validation");
const { validateObjectId, validateNoQueryParams } = require("../../utils/validation");
const { ValidationError } = require("../../utils/errors");

// @desc    Get all projects (read-only)
// @route   GET /api/projects
// @access  Private (All authenticated users)
const getAllProjects = asyncHandler(async (req, res) => {
    // Validate query parameters (reuse admin validation)
    adminProjectValidation.validateGetAllProjectsQuery(req.query);
    
    const projects = await projectService.getAllProjects(req.query);

    res.status(200).json({
        status: "success",
        results: projects.length,
        data: {
            projects,
        },
    });
});

// @desc    Get project by ID
// @route   GET /api/projects/:projectId
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
    // Validate: must be either MongoDB ObjectId or projectCode format
    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
        throw new ValidationError("Project ID is required and must be a string");
    }
    
    // Check if it's a valid ObjectId or projectCode format
    const isObjectId = mongoose.Types.ObjectId.isValid(projectId) && projectId.length === 24;
    const isProjectCode = /^PROJ-[A-Z0-9]{3}-\d{3}$/.test(projectId);
    
    if (!isObjectId && !isProjectCode) {
        throw new ValidationError(
            `Invalid Project ID: "${projectId}". Must be a valid MongoDB ObjectId (24 hex characters) or projectCode (format: PROJ-XXX-XXX)`
        );
    }
    
    // No query parameters allowed
    validateNoQueryParams(req.query, "GET /api/projects/:projectId");
    
    const project = await projectService.getProjectById(projectId);

    res.status(200).json({
        status: "success",
        data: {
            project,
        },
    });
});

module.exports = {
    getAllProjects,
    getProjectById,
};

