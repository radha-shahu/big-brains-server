const express = require("express");
const router = express.Router();
const projectController = require("./project.controller");
const { protect } = require("../../middlewares/auth.middleware");

// All routes require authentication
router.use(protect);

router.get("/", projectController.getAllProjects);
router.get("/:projectId", projectController.getProjectById);

module.exports = router;

