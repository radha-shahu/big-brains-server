const mongoose = require("mongoose");
const { ValidationError } = require("../../utils/errors");
const { ROLES } = require("../../constants/roles");

// Validate create user data
const validateCreateUser = (data) => {
    const {
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
        manager,
        currentProject,
    } = data;

    if (!firstName || !lastName) {
        throw new ValidationError("First name and last name are required");
    }

    if (!email) {
        throw new ValidationError("Email is required");
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Please provide a valid email");
    }

    if (!password) {
        throw new ValidationError("Password is required");
    }

    if (password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters");
    }

    // Validate role if provided
    if (role && !Object.values(ROLES).includes(role)) {
        throw new ValidationError(`Role must be one of: ${Object.values(ROLES).join(", ")}`);
    }

    // Validate phone format if provided
    if (phone && phone.trim().length > 0) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(phone)) {
            throw new ValidationError("Please provide a valid phone number");
        }
    }

    // Validate manager if provided
    if (manager !== undefined && manager !== null) {
        validateManagerId(manager);
    }

    // Validate currentProject if provided
    if (currentProject !== undefined && currentProject !== null) {
        validateProjectId(currentProject, "Current project");
    }

    return true;
};

// Validate manager ID (supports ObjectId or employeeId)
const validateManagerId = (managerId) => {
    if (!managerId) return null; // manager is optional
    
    if (typeof managerId !== "string") {
        throw new ValidationError("Manager must be a string (ObjectId or employeeId)");
    }

    // Check if it's a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(managerId) && managerId.length === 24;
    // Check if it's a valid employeeId format (EMP-YYYY-XXXX)
    const isEmployeeId = /^EMP-\d{4}-\d{4}$/.test(managerId);

    if (!isObjectId && !isEmployeeId) {
        throw new ValidationError(
            `Invalid manager ID: "${managerId}". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)`
        );
    }

    return true;
};

// Validate project ID (supports ObjectId or projectCode)
const validateProjectId = (projectId, fieldName = "Project") => {
    if (!projectId) return null; // project is optional
    
    if (typeof projectId !== "string") {
        throw new ValidationError(`${fieldName} must be a string (ObjectId or projectCode)`);
    }

    // Check if it's a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(projectId) && projectId.length === 24;
    // Check if it's a valid projectCode format (PROJ-XXX-XXX)
    const isProjectCode = /^PROJ-[A-Z0-9]{3}-\d{3}$/.test(projectId);

    if (!isObjectId && !isProjectCode) {
        throw new ValidationError(
            `Invalid ${fieldName.toLowerCase()} ID: "${projectId}". Must be a valid MongoDB ObjectId (24 hex characters) or projectCode (format: PROJ-XXX-XXX)`
        );
    }

    return true;
};

// Validate update user data
const validateUpdateUser = (data) => {
    const { role, phone, totalExperience, manager, currentProject, pastProjects } = data;

    // Validate role if provided
    if (role && !Object.values(ROLES).includes(role)) {
        throw new ValidationError(`Role must be one of: ${Object.values(ROLES).join(", ")}`);
    }

    // Validate phone format if provided
    if (phone && phone.trim().length > 0) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(phone)) {
            throw new ValidationError("Please provide a valid phone number");
        }
    }

    // Validate totalExperience if provided
    if (totalExperience !== undefined) {
        if (typeof totalExperience !== "number" || totalExperience < 0) {
            throw new ValidationError("Total experience must be a non-negative number");
        }
    }

    // Validate manager if provided
    if (manager !== undefined && manager !== null) {
        validateManagerId(manager);
    }

    // Validate currentProject if provided
    if (currentProject !== undefined && currentProject !== null) {
        validateProjectId(currentProject, "Current project");
    }

    // Validate pastProjects if provided
    if (pastProjects !== undefined && pastProjects !== null) {
        if (!Array.isArray(pastProjects)) {
            throw new ValidationError("pastProjects must be an array");
        }
        // Validate each project ID in the array
        pastProjects.forEach((projectId, index) => {
            if (typeof projectId !== "string") {
                throw new ValidationError(`pastProjects[${index}] must be a string (ObjectId or projectCode)`);
            }
            validateProjectId(projectId, `Past project at index ${index}`);
        });
    }

    return true;
};

// Validate update status
const validateUpdateStatus = (data) => {
    const { isActive } = data;

    if (typeof isActive !== "boolean") {
        throw new ValidationError("isActive must be a boolean value");
    }

    return true;
};

// Validate reset password
const validateResetPassword = (data) => {
    const { newPassword } = data;

    if (!newPassword) {
        throw new ValidationError("New password is required");
    }

    if (newPassword.length < 6) {
        throw new ValidationError("New password must be at least 6 characters");
    }

    return true;
};

// Validate query parameters for get all users
const validateGetAllUsersQuery = (queryParams) => {
    const allowedParams = ["role", "isActive", "search"];
    const providedParams = Object.keys(queryParams);

    // Check for unknown parameters
    const unknownParams = providedParams.filter((param) => !allowedParams.includes(param));
    if (unknownParams.length > 0) {
        throw new ValidationError(
            `Invalid query parameter(s): ${unknownParams.join(", ")}. Allowed parameters are: ${allowedParams.join(", ")}`
        );
    }

    // Validate role if provided
    if (queryParams.role !== undefined && queryParams.role !== null && queryParams.role !== "") {
        if (!Object.values(ROLES).includes(queryParams.role)) {
            throw new ValidationError(
                `Invalid role value: "${queryParams.role}". Role must be one of: ${Object.values(ROLES).join(", ")}`
            );
        }
    }

    // Validate isActive if provided
    if (queryParams.isActive !== undefined && queryParams.isActive !== null && queryParams.isActive !== "") {
        const isActiveStr = String(queryParams.isActive).toLowerCase();
        if (isActiveStr !== "true" && isActiveStr !== "false") {
            throw new ValidationError(
                `Invalid isActive value: "${queryParams.isActive}". isActive must be "true" or "false"`
            );
        }
    }

    // Validate search if provided (should be a non-empty string)
    if (queryParams.search !== undefined && queryParams.search !== null) {
        if (typeof queryParams.search !== "string" || queryParams.search.trim().length === 0) {
            throw new ValidationError("Search parameter must be a non-empty string");
        }
    }

    return true;
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateUpdateStatus,
    validateResetPassword,
    validateGetAllUsersQuery,
    validateManagerId,
    validateProjectId,
};

