const { ValidationError } = require("../../utils/errors");

const PROJECT_STATUSES = ["ACTIVE", "INACTIVE", "COMPLETED", "ON_HOLD"];

// Validate create project data
const validateCreateProject = (data) => {
    const { name, status } = data;

    if (!name || name.trim().length === 0) {
        throw new ValidationError("Project name is required");
    }

    if (status && !PROJECT_STATUSES.includes(status)) {
        throw new ValidationError(
            `Status must be one of: ${PROJECT_STATUSES.join(", ")}`
        );
    }

    return true;
};

// Validate update project data
const validateUpdateProject = (data) => {
    const { status, name } = data;

    if (status && !PROJECT_STATUSES.includes(status)) {
        throw new ValidationError(
            `Status must be one of: ${PROJECT_STATUSES.join(", ")}`
        );
    }

    if (name && name.trim().length === 0) {
        throw new ValidationError("Project name cannot be empty");
    }

    return true;
};

module.exports = {
    validateCreateProject,
    validateUpdateProject,
};

