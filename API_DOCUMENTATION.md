# API Documentation

## Base Information

- **Base URL**: `http://localhost:3000/api`
- **API Version**: 2.0.0
- **Content-Type**: `application/json`

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is obtained after successful login and should be included in all subsequent protected requests.

### Role-Based Access Control

The API uses role-based access control with three roles:
- **ADMIN**: Full access to all endpoints, can manage users and projects
- **EMPLOYEE**: Can view and update own profile (restricted fields), view projects and user directory
- **MANAGER**: Similar to employee with additional permissions (can be extended)

### Error Codes

All error responses include an `errorCode` field for programmatic handling:

| Error Code | Meaning | Common Scenarios |
|------------|---------|------------------|
| `INVALID_CREDENTIALS` | Wrong email or password | Login with incorrect credentials |
| `ACCOUNT_DISABLED` | User account is disabled | Login attempt with disabled account |
| `FORBIDDEN` | Insufficient permissions | Non-admin accessing admin endpoints |
| `VALIDATION_ERROR` | Invalid input data | Invalid query params, ObjectIds, or unknown fields |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist | User/project ID doesn't exist |
| `BAD_REQUEST` | Malformed request | Invalid request format |
| `UNAUTHORIZED` | Missing or invalid token | No token or expired token |
| `CONFLICT` | Resource already exists | Duplicate email or other unique field |

### Validation Error Details

The `VALIDATION_ERROR` code is used for various validation failures:

1. **Invalid Query Parameters**: Unknown parameter names or invalid values
   ```json
   {
     "status": "fail",
     "message": "Invalid query parameter(s): r. Allowed parameters are: role, isActive, search",
     "errorCode": "VALIDATION_ERROR"
   }
   ```

2. **Invalid ObjectId**: Invalid MongoDB ObjectId format in path parameters
   ```json
   {
     "status": "fail",
     "message": "Invalid User ID: \"invalid123\". Must be a valid MongoDB ObjectId",
     "errorCode": "VALIDATION_ERROR"
   }
   ```

3. **Unknown Fields**: Fields not allowed in request body
   ```json
   {
     "status": "fail",
     "message": "PATCH /api/users/me does not accept the following field(s): role. Allowed fields: firstName, lastName, email, phone, skills",
     "errorCode": "VALIDATION_ERROR"
   }
   ```

4. **Invalid Parameter Values**: Valid parameter name but invalid value
   ```json
   {
     "status": "fail",
     "message": "Invalid role value: \"A\". Role must be one of: ADMIN, EMPLOYEE, MANAGER",
     "errorCode": "VALIDATION_ERROR"
   }
   ```

---

## Authentication Endpoints

### 1. Login User

Authenticate an existing user and receive a JWT token.

- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates user credentials and returns a JWT token. Checks if account is active.

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP-2025-0001",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "EMPLOYEE",
      "designation": "Software Engineer",
      "department": "Engineering",
      "isActive": true,
      "isFirstLogin": false
    }
  }
}
```

#### Error Responses

**Status Code**: `401 Unauthorized`

**Scenario 1**: Invalid credentials
```json
{
  "status": "fail",
  "message": "Invalid email or password",
  "errorCode": "INVALID_CREDENTIALS"
}
```

**Scenario 2**: Account disabled
```json
{
  "status": "fail",
  "message": "Your account has been disabled. Please contact administrator.",
  "errorCode": "ACCOUNT_DISABLED"
}
```

---

### 2. Change Password

Change password after login.

- **Endpoint**: `POST /api/auth/change-password`
- **Access**: Private (All authenticated users)
- **Description**: Allows users to change their password

#### Request Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, minimum 6 characters)"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

#### Error Responses

**Status Code**: `401 Unauthorized`

**Scenario**: Incorrect current password
```json
{
  "status": "fail",
  "message": "Current password is incorrect",
  "errorCode": "INVALID_CREDENTIALS"
}
```

**Status Code**: `422 Validation Error`

**Scenario**: New password same as current or too short
```json
{
  "status": "fail",
  "message": "New password must be different from current password",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### 3. Get Current User

Get the currently authenticated user's information.

- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (All authenticated users)

#### Request Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP-2025-0001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "EMPLOYEE",
      "designation": "Software Engineer",
      "currentProject": {
        "id": "507f1f77bcf86cd799439012",
        "name": "CRM System",
        "projectCode": "PROJ-CRM-001"
      },
      "manager": {
        "id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "lastName": "Smith",
        "employeeId": "EMP-2025-0002"
      },
      "skills": ["JavaScript", "Node.js", "MongoDB"],
      "isActive": true
    }
  }
}
```

---

## User Endpoints (Employee Self-Service)

### 1. Get Employee Directory

Get a list of all active employees (read-only, limited information).

- **Endpoint**: `GET /api/users`
- **Access**: Private (All authenticated users)
- **Description**: Returns a directory of active employees with basic information

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "employeeId": "EMP-2025-0001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "designation": "Software Engineer",
        "department": "Engineering",
        "currentProject": {
          "name": "CRM System",
          "projectCode": "PROJ-CRM-001"
        }
      }
    ]
  }
}
```

---

### 2. Get Own Profile

Get current user's full profile information.

- **Endpoint**: `GET /api/users/me`
- **Access**: Private (All authenticated users)

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP-2025-0001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "EMPLOYEE",
      "designation": "Software Engineer",
      "department": "Engineering",
      "manager": {
        "id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "currentProject": {
        "id": "507f1f77bcf86cd799439012",
        "name": "CRM System",
        "projectCode": "PROJ-CRM-001"
      },
      "pastProjects": [],
      "skills": ["JavaScript", "Node.js"],
      "dateOfJoining": "2025-01-15T00:00:00.000Z",
      "totalExperience": 3,
      "location": "New York",
      "isActive": true
    }
  }
}
```

---

### 3. Update Own Profile

Update own profile (restricted fields only).

- **Endpoint**: `PATCH /api/users/me`
- **Access**: Private (All authenticated users)
- **Description**: Users can only update: firstName, lastName, email, phone, skills

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "skills": ["JavaScript", "Node.js", "React"]
}
```

**Note**: Backend will reject requests with unknown fields. Only the fields listed above are allowed.

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario**: Unknown field in request body
```json
{
  "status": "fail",
  "message": "PATCH /api/users/me does not accept the following field(s): role, designation. Allowed fields: firstName, lastName, email, phone, skills",
  "errorCode": "VALIDATION_ERROR"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

---

### 4. Get User by ID

Get user details by ID.

- **Endpoint**: `GET /api/users/:id`
- **Access**: Private (All authenticated users)

**Important**: The `:id` parameter accepts **either**:
- MongoDB `_id` (e.g., `507f1f77bcf86cd799439011`)
- `employeeId` (e.g., `EMP-2025-0001`)

---

## Project Endpoints (Read-Only)

### 1. Get All Projects

Get a list of all projects.

- **Endpoint**: `GET /api/projects`
- **Access**: Private (All authenticated users)

#### Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| status | string | Filter by status (ACTIVE, INACTIVE, COMPLETED, ON_HOLD) | No |
| search | string | Search in name, projectCode, or clientName | No |

**Note**: Only the above parameters are accepted. Invalid parameters or values will result in validation errors.

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario 1**: Invalid query parameter
```json
{
  "status": "fail",
  "message": "Invalid query parameter(s): filter. Allowed parameters are: status, search",
  "errorCode": "VALIDATION_ERROR"
}
```

**Scenario 2**: Invalid status value
```json
{
  "status": "fail",
  "message": "Invalid status value: \"PENDING\". Status must be one of: ACTIVE, INACTIVE, COMPLETED, ON_HOLD",
  "errorCode": "VALIDATION_ERROR"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "projects": [
      {
        "id": "507f1f77bcf86cd799439012",
        "projectCode": "PROJ-CRM-001",
        "name": "CRM System",
        "description": "Customer Relationship Management System",
        "status": "ACTIVE",
        "startDate": "2025-01-01T00:00:00.000Z",
        "endDate": "2025-12-31T00:00:00.000Z",
        "clientName": "Acme Corp"
      }
    ]
  }
}
```

---

### 2. Get Project by ID

Get project details by ID.

- **Endpoint**: `GET /api/projects/:projectId`
- **Access**: Private (All authenticated users)

**Important**: The `:projectId` parameter accepts **either**:
- MongoDB `_id` (returned as `id` in API responses) - e.g., `507f1f77bcf86cd799439012`
- `projectCode` (human-readable format) - e.g., `PROJ-CRM-001`

**Examples:**
- ✅ Valid: `/api/projects/507f1f77bcf86cd799439012` (MongoDB ObjectId)
- ✅ Valid: `/api/projects/PROJ-CRM-001` (projectCode)

**Note**: This endpoint does not accept query parameters.

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario**: Invalid ID format (neither ObjectId nor projectCode)
```json
{
  "status": "fail",
  "message": "Invalid Project ID: \"invalid123\". Must be a valid MongoDB ObjectId (24 hex characters) or projectCode (format: PROJ-XXX-XXX)",
  "errorCode": "VALIDATION_ERROR"
}
```

---

## Admin - User Management Endpoints

> **All admin endpoints require ADMIN role**

### 1. Create User

Create a new user (Admin only).

- **Endpoint**: `POST /api/admin/users`
- **Access**: Private/Admin
- **Description**: Creates a new user with auto-generated employeeId

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "temporary123",
  "phone": "+1234567890",
  "role": "EMPLOYEE",
  "designation": "Software Engineer",
  "department": "Engineering",
  "manager": "507f1f77bcf86cd799439013",
  "currentProject": "507f1f77bcf86cd799439012",
  "skills": ["JavaScript", "Node.js"],
  "dateOfJoining": "2025-01-15",
  "totalExperience": 3,
  "location": "New York"
}
```

**Note**: 
- `employeeId` is auto-generated (format: EMP-YYYY-XXXX) - **Do not send this field**
- `password` is required and will be hashed
- `skills` can be empty array or omitted
- `isActive` defaults to `true`
- `isFirstLogin` defaults to `true`

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario**: Unknown field in request body (e.g., employeeId)
```json
{
  "status": "fail",
  "message": "POST /api/admin/users does not accept the following field(s): employeeId, isActive. Allowed fields: firstName, lastName, email, password, phone, role, designation, department, manager, currentProject, skills, dateOfJoining, totalExperience, location",
  "errorCode": "VALIDATION_ERROR"
}
```

#### Success Response

**Status Code**: `201 Created`

```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "employeeId": "EMP-2025-0001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "EMPLOYEE",
      "isActive": true,
      "isFirstLogin": true
    }
  }
}
```

---

### 2. Get All Users

Get a list of all users with filters.

- **Endpoint**: `GET /api/admin/users`
- **Access**: Private/Admin

#### Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| role | string | Filter by role (ADMIN, EMPLOYEE, MANAGER) | No |
| isActive | boolean/string | Filter by active status ("true" or "false") | No |
| search | string | Search in firstName, lastName, email, employeeId | No |

**Note**: Only the above parameters are accepted. Any other query parameters will result in a validation error.

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "employeeId": "EMP-2025-0001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "EMPLOYEE",
        "designation": "Software Engineer",
        "isActive": true
      }
    ]
  }
}
```

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario 1**: Invalid query parameter name
```json
{
  "status": "fail",
  "message": "Invalid query parameter(s): r. Allowed parameters are: role, isActive, search",
  "errorCode": "VALIDATION_ERROR"
}
```

**Scenario 2**: Invalid role value
```json
{
  "status": "fail",
  "message": "Invalid role value: \"A\". Role must be one of: ADMIN, EMPLOYEE, MANAGER",
  "errorCode": "VALIDATION_ERROR"
}
```

**Scenario 3**: Invalid isActive value
```json
{
  "status": "fail",
  "message": "Invalid isActive value: \"yes\". isActive must be \"true\" or \"false\"",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### 3. Get User by ID

Get user details by ID.

- **Endpoint**: `GET /api/admin/users/:userId`
- **Access**: Private/Admin

**Important**: The `:userId` parameter accepts **either**:
- MongoDB `_id` (returned as `id` in API responses) - e.g., `507f1f77bcf86cd799439011`
- `employeeId` (human-readable format) - e.g., `EMP-2025-0001`

**Examples:**
- ✅ Valid: `/api/admin/users/507f1f77bcf86cd799439011` (MongoDB ObjectId)
- ✅ Valid: `/api/admin/users/EMP-2025-0001` (employeeId)

**Note**: This endpoint does not accept query parameters.

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario 1**: Invalid ID format (neither ObjectId nor employeeId)
```json
{
  "status": "fail",
  "message": "Invalid User ID: \"invalid123\". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)",
  "errorCode": "VALIDATION_ERROR"
}
```

**Scenario 2**: Query parameters provided
```json
{
  "status": "fail",
  "message": "GET /api/admin/users/:userId does not accept query parameters. Received: role",
  "errorCode": "VALIDATION_ERROR"
}
```

---

### 4. Update User

Update user details (Admin only fields).

- **Endpoint**: `PATCH /api/admin/users/:userId`
- **Access**: Private/Admin
- **Description**: Admin can update: role, designation, department, manager, currentProject, pastProjects, dateOfJoining, totalExperience, location, isActive

**Important**: The `:userId` parameter accepts **either**:
- MongoDB `_id` (e.g., `507f1f77bcf86cd799439011`)
- `employeeId` (e.g., `EMP-2025-0001`)

#### Request Body
```json
{
  "role": "MANAGER",
  "designation": "Senior Software Engineer",
  "manager": "507f1f77bcf86cd799439013",
  "currentProject": "507f1f77bcf86cd799439012",
  "totalExperience": 5,
  "location": "San Francisco"
}
```

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario 1**: Unknown field in request body
```json
{
  "status": "fail",
  "message": "PATCH /api/admin/users/:userId does not accept the following field(s): password, employeeId. Allowed fields: role, designation, department, manager, currentProject, pastProjects, dateOfJoining, totalExperience, location, isActive",
  "errorCode": "VALIDATION_ERROR"
}
```

**Scenario 2**: Invalid ID format
```json
{
  "status": "fail",
  "message": "Invalid User ID: \"invalid123\". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)",
  "errorCode": "VALIDATION_ERROR"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

---

### 5. Update User Status

Enable or disable a user.

- **Endpoint**: `PATCH /api/admin/users/:userId/status`
- **Access**: Private/Admin

**Important**: The `:userId` parameter accepts **either**:
- MongoDB `_id` (e.g., `507f1f77bcf86cd799439011`)
- `employeeId` (e.g., `EMP-2025-0001`)

#### Request Body
```json
{
  "isActive": false
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "User disabled successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "isActive": false
    }
  }
}
```

**Note**: Disabled users cannot login and will receive `ACCOUNT_DISABLED` error.

---

### 6. Reset User Password

Reset a user's password (Admin only).

- **Endpoint**: `POST /api/admin/users/:userId/reset-password`
- **Access**: Private/Admin

**Important**: The `:userId` parameter accepts **either**:
- MongoDB `_id` (e.g., `507f1f77bcf86cd799439011`)
- `employeeId` (e.g., `EMP-2025-0001`)

#### Request Body
```json
{
  "newPassword": "newpassword123"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

**Note**: After password reset, `isFirstLogin` is set to `true`, requiring user to change password on next login.

---

## Admin - Project Management Endpoints

> **All admin endpoints require ADMIN role**

### 1. Create Project

Create a new project (Admin only).

- **Endpoint**: `POST /api/admin/projects`
- **Access**: Private/Admin
- **Description**: Creates a new project with auto-generated projectCode

#### Request Body
```json
{
  "name": "CRM System",
  "description": "Customer Relationship Management System",
  "status": "ACTIVE",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "clientName": "Acme Corp"
}
```

**Note**: 
- `projectCode` is auto-generated (format: PROJ-XXX-XXX, based on project name) - **Do not send this field**
- `status` defaults to "ACTIVE" if not provided
- Valid statuses: ACTIVE, INACTIVE, COMPLETED, ON_HOLD

#### Error Responses

**Status Code**: `422 Validation Error`

**Scenario**: Unknown field in request body
```json
{
  "status": "fail",
  "message": "POST /api/admin/projects does not accept the following field(s): projectCode. Allowed fields: name, description, status, startDate, endDate, clientName",
  "errorCode": "VALIDATION_ERROR"
}
```

#### Success Response

**Status Code**: `201 Created`

```json
{
  "status": "success",
  "message": "Project created successfully",
  "data": {
    "project": {
      "id": "507f1f77bcf86cd799439012",
      "projectCode": "PROJ-CRM-001",
      "name": "CRM System",
      "status": "ACTIVE"
    }
  }
}
```

---

### 2. Get All Projects

Get a list of all projects with filters.

- **Endpoint**: `GET /api/admin/projects`
- **Access**: Private/Admin

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| search | string | Search in name, projectCode, or clientName |

---

### 3. Get Project by ID

Get project details by ID.

- **Endpoint**: `GET /api/admin/projects/:projectId`
- **Access**: Private/Admin

**Important**: The `:projectId` parameter accepts **either**:
- MongoDB `_id` (e.g., `507f1f77bcf86cd799439012`)
- `projectCode` (e.g., `PROJ-CRM-001`)

---

### 4. Update Project

Update project details.

- **Endpoint**: `PATCH /api/admin/projects/:projectId`
- **Access**: Private/Admin
- **Description**: Admin can update: name, description, status, startDate, endDate, clientName

**Important**: The `:projectId` parameter accepts **either**:
- MongoDB `_id` (e.g., `507f1f77bcf86cd799439012`)
- `projectCode` (e.g., `PROJ-CRM-001`)

#### Request Body
```json
{
  "name": "CRM System v2",
  "description": "Updated description",
  "status": "COMPLETED",
  "endDate": "2025-06-30"
}
```

#### Success Response

**Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Project updated successfully",
  "data": {
    "project": {
      // Updated project object
    }
  }
}
```

---

## Common Response Structure

### Success Response Format
```json
{
  "status": "success",
  "message": "Optional success message",
  "token": "JWT token (only for auth endpoints)",
  "data": {
    // Response data here
  }
}
```

### Error Response Format
```json
{
  "status": "fail" | "error",
  "message": "Error message describing what went wrong",
  "errorCode": "ERROR_CODE"
}
```

**Note**: In development mode, error responses may include a `stack` field with stack trace information.

---

## HTTP Status Codes

| Status Code | Meaning | When It's Used |
|-------------|---------|----------------|
| 200 | OK | Successful GET, PATCH requests |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Invalid input, missing required fields |
| 401 | Unauthorized | Missing or invalid authentication token, account disabled |
| 403 | Forbidden | Valid token but insufficient permissions (not admin) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side error |

---

## Field Restrictions Summary

### Employee Self-Service (PATCH /api/users/me)
**Can Update:**
- firstName
- lastName
- email
- phone
- skills

**Cannot Update (Backend Enforces):**
- role
- designation
- department
- manager
- currentProject
- pastProjects
- dateOfJoining
- totalExperience
- location
- isActive
- employeeId

### Admin User Management (PATCH /api/admin/users/:userId)
**Can Update:**
- role
- designation
- department
- manager
- currentProject
- pastProjects
- dateOfJoining
- totalExperience
- location
- isActive

**Cannot Update:**
- password (use reset-password endpoint)
- employeeId (auto-generated)
- email (can be updated by user themselves)

---

## Auto-Generated Fields

### employeeId
- **Format**: `EMP-YYYY-XXXX`
- **Example**: `EMP-2025-0001`
- **Generated**: On user creation
- **Client**: Never send this field in request bodies
- **Usage**: Can be used as `:userId` parameter in API endpoints (alternative to MongoDB `_id`)

### projectCode
- **Format**: `PROJ-XXX-XXX`
- **Example**: `PROJ-CRM-001` (based on project name)
- **Generated**: On project creation
- **Client**: Never send this field in request bodies
- **Usage**: Can be used as `:projectId` parameter in API endpoints (alternative to MongoDB `_id`)

## ID Parameter Support

The API supports **dual ID formats** for better flexibility:

### User Endpoints
All endpoints that use `:userId` or `:id` accept:
- **MongoDB `_id`**: 24-character hexadecimal string (e.g., `507f1f77bcf86cd799439011`)
- **employeeId**: Human-readable format (e.g., `EMP-2025-0001`)

**Examples:**
```bash
# Using MongoDB _id
GET /api/admin/users/507f1f77bcf86cd799439011

# Using employeeId
GET /api/admin/users/EMP-2025-0001
```

### Project Endpoints
All endpoints that use `:projectId` accept:
- **MongoDB `_id`**: 24-character hexadecimal string (e.g., `507f1f77bcf86cd799439012`)
- **projectCode**: Human-readable format (e.g., `PROJ-CRM-001`)

**Examples:**
```bash
# Using MongoDB _id
GET /api/projects/507f1f77bcf86cd799439012

# Using projectCode
GET /api/projects/PROJ-CRM-001
```

**Benefits:**
- ✅ Human-readable IDs for better UX
- ✅ Database efficiency with MongoDB `_id` as primary key
- ✅ Flexibility to use either format
- ✅ Both formats are indexed for fast lookups

---

## Testing Examples

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get own profile (replace TOKEN)
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TOKEN"

# Create user (Admin only, replace TOKEN)
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "temp123",
    "role": "EMPLOYEE"
  }'
```

---

## Changelog

### Version 2.0.0
- Added role-based access control (ADMIN, EMPLOYEE, MANAGER)
- Added admin user management endpoints
- Added admin project management endpoints
- Added employee self-service endpoints
- Added change password functionality
- Added account disabling functionality
- Added auto-generated employeeId and projectCode
- Removed public registration (admin-only user creation)
- Added standardized error codes
- Enhanced user and project models with additional fields
- **Added comprehensive input validation**:
  - Query parameter validation (rejects unknown/invalid parameters)
  - Path parameter validation (validates ObjectIds and custom IDs)
  - Request body validation (rejects unknown fields)
  - Clear error messages for all validation failures
- **Added dual ID support**:
  - All user endpoints accept both MongoDB `_id` and `employeeId`
  - All project endpoints accept both MongoDB `_id` and `projectCode`
  - Human-readable IDs for better UX while maintaining database efficiency

### Version 1.0.0
- Initial API release
- User registration endpoint
- User login endpoint
- Get current user endpoint
- JWT authentication
