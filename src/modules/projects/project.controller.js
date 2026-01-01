const projectService = require("./project.service");
const { asyncHandler } = require("../../middlewares/error.middleware");

// @desc    Get all projects (read-only)
// @route   GET /api/projects
// @access  Private (All authenticated users)
const getAllProjects = asyncHandler(async (req, res) => {
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
    const project = await projectService.getProjectById(req.params.projectId);

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

