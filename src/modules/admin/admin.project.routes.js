const express = require("express");
const router = express.Router();
const adminProjectController = require("./admin.project.controller");
const { protect, requireAdmin } = require("../../middlewares/auth.middleware");

// All routes require authentication and admin role
router.use(protect, requireAdmin);

router.post("/", adminProjectController.createProject);
router.get("/", adminProjectController.getAllProjects);
router.get("/:projectId", adminProjectController.getProjectById);
router.patch("/:projectId", adminProjectController.updateProject);

module.exports = router;

