const adminProjectService = require("./admin.project.service");
const adminProjectValidation = require("./admin.project.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");
const { validateObjectId, validateNoQueryParams, validateNoUnknownFields } = require("../../utils/validation");

// @desc    Create new project (Admin only)
// @route   POST /api/admin/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
    // Validate request body
    adminProjectValidation.validateCreateProject(req.body);
    
    // Validate no unknown fields (projectCode is auto-generated, so not allowed)
    const allowedFields = ["name", "description", "status", "startDate", "endDate", "clientName"];
    validateNoUnknownFields(req.body, allowedFields, "POST /api/admin/projects");

    const project = await adminProjectService.createProject(req.body);

    res.status(201).json({
        status: "success",
        message: "Project created successfully",
        data: {
            project,
        },
    });
});

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
const getAllProjects = asyncHandler(async (req, res) => {
    // Validate query parameters
    adminProjectValidation.validateGetAllProjectsQuery(req.query);
    
    const projects = await adminProjectService.getAllProjects(req.query);

    res.status(200).json({
        status: "success",
        results: projects.length,
        data: {
            projects,
        },
    });
});

// @desc    Get project by ID
// @route   GET /api/admin/projects/:projectId
// @access  Private/Admin
const getProjectById = asyncHandler(async (req, res) => {
    // Validate ObjectId
    validateObjectId(req.params.projectId, "Project ID");
    
    // No query parameters allowed
    validateNoQueryParams(req.query, "GET /api/admin/projects/:projectId");
    
    const project = await adminProjectService.getProjectById(req.params.projectId);

    res.status(200).json({
        status: "success",
        data: {
            project,
        },
    });
});

// @desc    Update project (Admin only)
// @route   PATCH /api/admin/projects/:projectId
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
    // Validate ObjectId
    validateObjectId(req.params.projectId, "Project ID");
    
    // Validate request body
    adminProjectValidation.validateUpdateProject(req.body);
    
    // Validate no unknown fields
    const allowedFields = ["name", "description", "status", "startDate", "endDate", "clientName"];
    validateNoUnknownFields(req.body, allowedFields, "PATCH /api/admin/projects/:projectId");
    
    const project = await adminProjectService.updateProject(req.params.projectId, req.body);

    res.status(200).json({
        status: "success",
        message: "Project updated successfully",
        data: {
            project,
        },
    });
});

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
};

