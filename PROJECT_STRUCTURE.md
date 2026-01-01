# Project Structure

This document explains the scalable, maintainable project structure we've implemented.

## 📁 Directory Structure

```
big-brains-server/
├── src/
│   ├── app.js                 # Express app setup and middleware configuration
│   ├── server.js              # Server entry point (starts the server)
│   │
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js              # Environment variables configuration
│   │
│   ├── modules/               # Domain-based modules (feature-based organization)
│   │   ├── auth/
│   │   │   ├── auth.routes.js      # Authentication routes
│   │   │   ├── auth.controller.js  # Request/response handling
│   │   │   ├── auth.service.js     # Business logic (login, changePassword)
│   │   │   └── auth.validation.js # Input validation
│   │   │
│   │   ├── users/
│   │   │   ├── user.model.js       # Mongoose schema/model
│   │   │   ├── user.routes.js      # User routes (employee self-service)
│   │   │   ├── user.controller.js # Request/response handling
│   │   │   ├── user.service.js    # Business logic
│   │   │   ├── user.validation.js # Input validation
│   │   │   └── user.dto.js        # Data Transfer Objects
│   │   │
│   │   ├── projects/
│   │   │   ├── project.model.js    # Project Mongoose schema/model
│   │   │   ├── project.routes.js   # Project routes (read-only)
│   │   │   ├── project.controller.js # Request/response handling
│   │   │   ├── project.service.js  # Business logic
│   │   │   └── project.dto.js      # Data Transfer Objects
│   │   │
│   │   └── admin/
│   │       ├── admin.user.routes.js      # Admin user management routes
│   │       ├── admin.user.controller.js  # Admin user controllers
│   │       ├── admin.user.service.js     # Admin user business logic
│   │       ├── admin.user.validation.js  # Admin user validation
│   │       ├── admin.project.routes.js   # Admin project management routes
│   │       ├── admin.project.controller.js # Admin project controllers
│   │       ├── admin.project.service.js   # Admin project business logic
│   │       └── admin.project.validation.js # Admin project validation
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT authentication & role-based middleware
│   │   └── error.middleware.js     # Error handling middleware
│   │
│   ├── utils/
│   │   ├── errors.js               # Custom error classes with error codes
│   │   ├── jwt.js                  # JWT token utilities
│   │   ├── password.js             # Password hashing utilities
│   │   └── generators.js           # Auto-generation utilities (employeeId, projectCode)
│   │
│   └── constants/
│       └── roles.js                # Application constants (ADMIN, EMPLOYEE, MANAGER)
│
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── API_DOCUMENTATION.md         # Complete API documentation
├── AUTHENTICATION_GUIDE.md      # Authentication & authorization guide
└── README.md                    # Project documentation
```

## 🏗️ Architecture Layers

### 1. **Routes Layer** (`*.routes.js`)
- Defines API endpoints
- Maps HTTP methods to controller functions
- Applies middleware (auth, validation, etc.)
- Example: `auth.routes.js`, `admin.user.routes.js`

### 2. **Controller Layer** (`*.controller.js`)
- Handles HTTP requests and responses
- Validates input using validation layer
- Calls service layer for business logic
- Returns formatted responses
- Example: `auth.controller.js`, `admin.user.controller.js`

### 3. **Service Layer** (`*.service.js`)
- Contains business logic
- Interacts with models/database
- Returns data (not HTTP responses)
- Reusable across different controllers
- Example: `auth.service.js`, `admin.user.service.js`

### 4. **Validation Layer** (`*.validation.js`)
- Validates input data
- Throws errors for invalid data
- Centralized validation logic
- Example: `auth.validation.js`, `admin.user.validation.js`

### 5. **Model Layer** (`*.model.js`)
- Mongoose schemas and models
- Database structure definition
- Model methods and hooks
- Example: `user.model.js`, `project.model.js`

### 6. **DTO Layer** (`*.dto.js`)
- Data Transfer Objects
- Shapes data for API responses
- Ensures consistent response format
- Handles populated fields
- Example: `user.dto.js`, `project.dto.js`

## 🎯 Module Organization

### Auth Module (`modules/auth/`)
Handles authentication:
- Login
- Change password
- Get current user

### Users Module (`modules/users/`)
Employee self-service:
- Get employee directory
- Get own profile
- Update own profile (restricted fields)

### Projects Module (`modules/projects/`)
Project read-only access:
- Get all projects
- Get project by ID

### Admin Module (`modules/admin/`)
Admin-only functionality:
- User management (create, update, disable, reset password)
- Project management (create, update)

## 🔐 Security Architecture

### Middleware Stack

1. **protect** - Verifies JWT token and checks user is active
2. **requireAdmin** - Ensures user has ADMIN role
3. **requireRole** - Checks for specific role(s)

### Field-Level Security

- **Backend Enforcement**: Restrictions are enforced at the service layer
- **Employee Updates**: Only allowed fields are processed
- **Admin Updates**: Full control over admin-managed fields

## 📝 Adding a New Module

To add a new feature (e.g., "tasks"):

1. Create module directory: `src/modules/tasks/`
2. Create files:
   - `task.model.js` - Database schema
   - `task.routes.js` - API routes
   - `task.controller.js` - Request handlers
   - `task.service.js` - Business logic
   - `task.validation.js` - Input validation
   - `task.dto.js` - Data transfer objects

3. Register routes in `src/app.js`:
   ```javascript
   const taskRoutes = require("./modules/tasks/task.routes");
   app.use("/api/tasks", taskRoutes);
   ```

## 🔄 Data Flow

```
Request → Routes → Middleware → Controller → Validation → Service → Model → Database
                                                                      ↓
Response ← Routes ← Controller ← Service ← Model ← Database
```

### Example: Creating a User (Admin)

```
POST /api/admin/users
  ↓
admin.user.routes.js (protect, requireAdmin)
  ↓
admin.user.controller.js (createUser)
  ↓
admin.user.validation.js (validateCreateUser)
  ↓
admin.user.service.js (createUser)
  ↓
utils/generators.js (generateEmployeeId)
  ↓
user.model.js (User.create)
  ↓
MongoDB
  ↓
user.dto.js (format response)
  ↓
Response to client
```

## 📦 Key Files Explained

### `src/app.js`
- Express app configuration
- Middleware setup
- Route registration
- Error handling setup

### `src/server.js`
- Server startup
- Database connection
- Port configuration

### `src/config/env.js`
- Centralized environment variable management
- Type-safe configuration
- Default values

### `src/config/db.js`
- MongoDB connection logic
- Connection error handling

### `src/middlewares/auth.middleware.js`
- JWT token verification
- User active status check
- Role-based access control

### `src/utils/generators.js`
- Auto-generation of unique IDs
- `generateEmployeeId()` - Creates EMP-YYYY-XXXX format
- `generateProjectCode()` - Creates PROJ-XXX-XXX format

### `src/utils/errors.js`
- Custom error classes
- Standardized error codes
- Consistent error responses

## 🚀 Running the Project

```bash
# Start the server
npm start

# Or for development
npm run dev
```

The server will start on the port specified in `.env` (default: 3000)

## 📊 API Route Structure

```
/api
├── /auth
│   ├── POST   /login
│   ├── POST   /change-password
│   └── GET    /me
│
├── /users
│   ├── GET    /              # Employee directory
│   ├── GET    /me            # Own profile
│   ├── PATCH  /me            # Update own profile
│   └── GET    /:id           # Get user by ID
│
├── /projects
│   ├── GET    /              # List projects
│   └── GET    /:projectId    # Get project by ID
│
└── /admin
    ├── /users
    │   ├── POST   /                    # Create user
    │   ├── GET    /                    # List users
    │   ├── GET    /:userId             # Get user
    │   ├── PATCH  /:userId             # Update user
    │   ├── PATCH  /:userId/status      # Enable/disable
    │   └── POST   /:userId/reset-password
    │
    └── /projects
        ├── POST   /                    # Create project
        ├── GET    /                    # List projects
        ├── GET    /:projectId         # Get project
        └── PATCH  /:projectId         # Update project
```

## 🔒 Security Considerations

- Environment variables are in `.env` (not committed)
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation on all endpoints
- Error messages don't leak sensitive information
- Account status checking (isActive)
- Field-level restrictions enforced at backend

## 📚 Next Steps

As the project grows, consider adding:

1. **Logging**: Add a logger utility (`src/utils/logger.js`)
2. **Testing**: Add test files for each module
3. **Documentation**: API documentation (Swagger/OpenAPI)
4. **Rate Limiting**: Add rate limiting middleware
5. **CORS**: Configure CORS for production
6. **Validation Library**: Use Joi or Yup for advanced validation
7. **Caching**: Add Redis for caching
8. **File Upload**: Add file upload handling
9. **Email Service**: Add email utilities
10. **Background Jobs**: Add job queue (Bull, Agenda)
11. **Audit Logging**: Track admin actions
12. **Password Reset**: Email-based password reset flow

## 🎨 Design Principles

### 1. Separation of Concerns
- Each layer has a single responsibility
- Business logic in services, not controllers
- Validation separated from business logic

### 2. DRY (Don't Repeat Yourself)
- Reusable services
- Shared utilities
- Common middleware

### 3. Security First
- Never trust the client
- Backend enforces all restrictions
- Validate all inputs
- Check permissions at every level

### 4. Scalability
- Modular structure
- Easy to add new features
- Clear boundaries between modules

### 5. Maintainability
- Consistent naming conventions
- Clear file organization
- Comprehensive documentation
