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
│   │   │   ├── auth.service.js     # Business logic
│   │   │   └── auth.validation.js # Input validation
│   │   │
│   │   └── users/
│   │       ├── user.model.js       # Mongoose schema/model
│   │       ├── user.routes.js      # User routes
│   │       ├── user.controller.js  # Request/response handling
│   │       ├── user.service.js     # Business logic
│   │       ├── user.validation.js  # Input validation
│   │       └── user.dto.js         # Data Transfer Objects
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT authentication middleware
│   │   └── error.middleware.js     # Error handling middleware
│   │
│   ├── utils/
│   │   ├── errors.js               # Custom error classes
│   │   ├── jwt.js                  # JWT token utilities
│   │   └── password.js             # Password hashing utilities
│   │
│   └── constants/
│       └── roles.js                # Application constants
│
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## 🏗️ Architecture Layers

### 1. **Routes Layer** (`*.routes.js`)
- Defines API endpoints
- Maps HTTP methods to controller functions
- Applies middleware (auth, validation, etc.)

### 2. **Controller Layer** (`*.controller.js`)
- Handles HTTP requests and responses
- Validates input using validation layer
- Calls service layer for business logic
- Returns formatted responses

### 3. **Service Layer** (`*.service.js`)
- Contains business logic
- Interacts with models/database
- Returns data (not HTTP responses)
- Reusable across different controllers

### 4. **Validation Layer** (`*.validation.js`)
- Validates input data
- Throws errors for invalid data
- Centralized validation logic

### 5. **Model Layer** (`*.model.js`)
- Mongoose schemas and models
- Database structure definition
- Model methods and hooks

### 6. **DTO Layer** (`*.dto.js`)
- Data Transfer Objects
- Shapes data for API responses
- Ensures consistent response format

## 🎯 Benefits of This Structure

### 1. **Scalability**
- Easy to add new modules (just create a new folder in `modules/`)
- Each module is self-contained
- Clear separation of concerns

### 2. **Maintainability**
- Related code is grouped together
- Easy to find and modify code
- Changes are isolated to specific modules

### 3. **Testability**
- Service layer can be tested independently
- Controllers are thin and easy to test
- Validation logic is separated

### 4. **Reusability**
- Services can be reused across different controllers
- Utilities are centralized
- DTOs ensure consistent data formatting

### 5. **Team Collaboration**
- Multiple developers can work on different modules
- Clear boundaries between modules
- Reduced merge conflicts

## 📝 Adding a New Module

To add a new feature (e.g., "products"):

1. Create module directory: `src/modules/products/`
2. Create files:
   - `product.model.js` - Database schema
   - `product.routes.js` - API routes
   - `product.controller.js` - Request handlers
   - `product.service.js` - Business logic
   - `product.validation.js` - Input validation
   - `product.dto.js` - Data transfer objects (optional)

3. Register routes in `src/app.js`:
   ```javascript
   const productRoutes = require("./modules/products/product.routes");
   app.use("/api/products", productRoutes);
   ```

## 🔄 Data Flow

```
Request → Routes → Middleware → Controller → Validation → Service → Model → Database
                                                                      ↓
Response ← Routes ← Controller ← Service ← Model ← Database
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

## 🚀 Running the Project

```bash
# Start the server
npm start

# Or for development
npm run dev
```

The server will start on the port specified in `.env` (default: 3000)

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

## 🔒 Security Considerations

- Environment variables are in `.env` (not committed)
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation on all endpoints
- Error messages don't leak sensitive information

