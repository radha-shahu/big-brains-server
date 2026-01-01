const User = require("../modules/users/user.model");
const Project = require("../modules/projects/project.model");

/**
 * Generate unique employeeId in format: EMP-YYYY-XXXX
 * Example: EMP-2025-0001
 */
const generateEmployeeId = async () => {
    const currentYear = new Date().getFullYear();
    const prefix = `EMP-${currentYear}-`;

    // Find the latest employeeId for this year
    const latestUser = await User.findOne({
        employeeId: { $regex: `^${prefix}` },
    })
        .sort({ employeeId: -1 })
        .select("employeeId");

    let sequence = 1;

    if (latestUser && latestUser.employeeId) {
        // Extract the sequence number from the latest employeeId
        const latestSequence = parseInt(
            latestUser.employeeId.replace(prefix, ""),
            10
        );
        sequence = latestSequence + 1;
    }

    // Format sequence with leading zeros (4 digits)
    const formattedSequence = sequence.toString().padStart(4, "0");
    return `${prefix}${formattedSequence}`;
};

/**
 * Generate unique projectCode in format: PROJ-XXX-XXX
 * Example: PROJ-CRM-001
 * Uses first 3 uppercase letters of project name
 */
const generateProjectCode = async (projectName) => {
    if (!projectName || projectName.trim().length === 0) {
        throw new Error("Project name is required to generate project code");
    }

    // Extract first 3 letters of project name, convert to uppercase
    const namePrefix = projectName
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, "X"); // If less than 3 chars, pad with X

    const prefix = `PROJ-${namePrefix}-`;

    // Find the latest projectCode with this prefix
    const latestProject = await Project.findOne({
        projectCode: { $regex: `^${prefix}` },
    })
        .sort({ projectCode: -1 })
        .select("projectCode");

    let sequence = 1;

    if (latestProject && latestProject.projectCode) {
        // Extract the sequence number from the latest projectCode
        const latestSequence = parseInt(
            latestProject.projectCode.replace(prefix, ""),
            10
        );
        sequence = latestSequence + 1;
    }

    // Format sequence with leading zeros (3 digits)
    const formattedSequence = sequence.toString().padStart(3, "0");
    return `${prefix}${formattedSequence}`;
};

module.exports = {
    generateEmployeeId,
    generateProjectCode,
};

