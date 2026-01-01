# Big Brains Server

A comprehensive Node.js/Express REST API server for employee and project management with role-based access control (RBAC). Built with security-first principles and scalable architecture.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, EMPLOYEE, MANAGER)
- Account status management (enable/disable users)
- Password change functionality
- Secure password hashing with bcrypt

### User Management
- **Admin Features:**
  - Create new users with auto-generated employee IDs
  - View and manage all users
  - Update user details (role, designation, manager, projects, etc.)
  - Enable/disable user accounts
  - Reset user passwords
  - Filter and search users

- **Employee Self-Service:**
  - View own profile
  - Update own profile (restricted fields: name, email, phone, skills)
  - View employee directory
  - View assigned projects

### Project Management
- **Admin Features:**
  - Create projects with auto-generated project codes
  - Update project details
  - Manage project status
  - View all projects

- **Employee Access:**
  - View all projects (read-only)
  - View project details

### Security Features
- Backend-enforced field restrictions
- Account status validation on login
- Standardized error codes
- Input validation on all endpoints
- Protected routes with JWT authentication
- Role-based middleware protection

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MongoDB** (v4.4 or higher) - running locally or connection string to remote instance

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd big-brains-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Or create a `.env` file manually with the following content:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://127.0.0.1:27017/userdb

   # JWT Configuration
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Configure environment variables**
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set a strong, random `JWT_SECRET` (use a secure random string generator)
   - Adjust `PORT` if needed (default: 3000)

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

## 🚀 Running the Project

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Health Check
Visit `http://localhost:3000/api` to verify the server is running.

## 👤 Creating the First Admin User

Since user registration is disabled (admin-only user creation), you need to create the first admin user before you can use the API.

### Recommended: Using Seed Script

Run the seed script to create the first admin user:

```bash
node scripts/seed-admin.js
```

This will:
- ✅ Connect to your MongoDB database
- ✅ Generate an employee ID automatically
- ✅ Hash the password securely
- ✅ Create the admin user with role "ADMIN"
- ✅ Check if admin already exists to prevent duplicates

**Default Admin Credentials:**
- Email: `john@example.com`
- Password: `temporary123`
- Role: `ADMIN`

**⚠️ Important**: Change the password after first login using `/api/auth/change-password`

### Customizing Admin Details

Edit `scripts/seed-admin.js` to change the admin user details before running:

```javascript
const adminData = {
    firstName: "Your",
    lastName: "Name",
    email: "your-email@example.com",
    password: "your-secure-password",
    // ... other fields
};
```

### Alternative: Direct MongoDB Insert

If you prefer to insert directly into MongoDB, see [scripts/mongodb-admin-query.md](./scripts/mongodb-admin-query.md) for instructions.

**Note**: You'll need to hash the password manually using bcrypt (cost factor 12) if inserting directly.

## 📁 Project Structure

```
big-brains-server/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── config/                   # Configuration files
│   │   ├── db.js                 # MongoDB connection
│   │   └── env.js                # Environment variables
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication module
│   │   ├── users/                # User module (employee self-service)
│   │   ├── projects/             # Project module
│   │   └── admin/                # Admin module (user & project management)
│   ├── middlewares/              # Express middlewares
│   │   ├── auth.middleware.js    # JWT & role-based auth
│   │   └── error.middleware.js   # Error handling
│   ├── utils/                    # Utility functions
│   │   ├── errors.js             # Custom error classes
│   │   ├── jwt.js                # JWT utilities
│   │   └── generators.js         # ID generators (employeeId, projectCode)
│   └── constants/                # Application constants
│       └── roles.js              # Role definitions
├── .env                          # Environment variables (not committed)
├── package.json                  # Dependencies
├── API_DOCUMENTATION.md          # Complete API documentation
├── AUTHENTICATION_GUIDE.md       # Auth & authorization guide
├── PROJECT_STRUCTURE.md          # Detailed project structure
└── README.md                     # This file
```

For detailed structure information, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password (Protected)
- `GET /api/auth/me` - Get current user (Protected)

### Users (Employee Self-Service)
- `GET /api/users` - Get employee directory (Protected)
- `GET /api/users/me` - Get own profile (Protected)
- `PATCH /api/users/me` - Update own profile (Protected, restricted fields)
- `GET /api/users/:id` - Get user by ID (Protected)

### Projects (Read-Only)
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:projectId` - Get project by ID (Protected)

### Admin - User Management
- `POST /api/admin/users` - Create user (Admin only)
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/users/:userId` - Get user by ID (Admin only)
- `PATCH /api/admin/users/:userId` - Update user (Admin only)
- `PATCH /api/admin/users/:userId/status` - Enable/disable user (Admin only)
- `POST /api/admin/users/:userId/reset-password` - Reset password (Admin only)

### Admin - Project Management
- `POST /api/admin/projects` - Create project (Admin only)
- `GET /api/admin/projects` - Get all projects (Admin only)
- `GET /api/admin/projects/:projectId` - Get project by ID (Admin only)
- `PATCH /api/admin/projects/:projectId` - Update project (Admin only)

For complete API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🔐 Authentication

### Getting Started

1. **Login to get a token:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   ```

2. **Use the token in subsequent requests:**
   ```bash
   curl -X GET http://localhost:3000/api/users/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Role-Based Access

- **ADMIN**: Full access to all endpoints, can manage users and projects
- **EMPLOYEE**: Can view and update own profile (restricted fields), view projects
- **MANAGER**: Similar to employee (can be extended)

For detailed authentication guide, see [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md).

## 🗄️ Database Models

### User Model
- `employeeId` (auto-generated): EMP-YYYY-XXXX format
- `firstName`, `lastName`, `email`, `phone`
- `password` (hashed)
- `role`: ADMIN, EMPLOYEE, or MANAGER
- `designation`, `department`
- `manager` (reference to User)
- `currentProject` (reference to Project)
- `pastProjects` (array of Project references)
- `skills` (array of strings)
- `dateOfJoining`, `totalExperience`, `location`
- `isActive`, `isFirstLogin`
- `createdAt`, `updatedAt`

### Project Model
- `projectCode` (auto-generated): PROJ-XXX-XXX format
- `name`, `description`
- `status`: ACTIVE, INACTIVE, COMPLETED, ON_HOLD
- `startDate`, `endDate`
- `clientName`
- `createdAt`, `updatedAt`

## 🔒 Security Features

### Password Security
- Passwords hashed with bcrypt (cost factor: 12)
- Minimum password length: 6 characters
- Passwords never returned in API responses

### Authentication Security
- JWT tokens with configurable expiration (default: 7 days)
- Account status validation on login and protected routes
- Token verification on every protected request

### Authorization Security
- Role-based middleware protection
- Backend-enforced field restrictions
- Admin-only endpoints protected

### Input Validation
- All inputs validated before processing
- Email format validation
- Phone number validation
- Standardized error responses

## 🧪 Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create User (Admin):**
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "temp123",
    "role": "EMPLOYEE"
  }'
```

### Using Postman/Thunder Client

1. Import the API endpoints
2. Set up environment variables for base URL and tokens
3. Login to get a token
4. Use the token in Authorization header for protected endpoints

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://127.0.0.1:27017/userdb | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | 7d | No |

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference with examples
- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - Auth & authorization details
- [Project Structure](./PROJECT_STRUCTURE.md) - Architecture and structure details

## 🚨 Error Handling

The API uses standardized error codes for programmatic handling:

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `ACCOUNT_DISABLED` | 401 | User account is disabled |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `RESOURCE_NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Resource already exists |

All error responses follow this format:
```json
{
  "status": "fail" | "error",
  "message": "Error message",
  "errorCode": "ERROR_CODE"
}
```

## 🔄 Auto-Generated Fields

### employeeId
- **Format**: `EMP-YYYY-XXXX`
- **Example**: `EMP-2025-0001`
- **Generated**: Automatically on user creation
- **Note**: Clients should never send this field

### projectCode
- **Format**: `PROJ-XXX-XXX`
- **Example**: `PROJ-CRM-001` (based on project name)
- **Generated**: Automatically on project creation
- **Note**: Clients should never send this field

## ⚠️ Important Notes

### First Admin User
Since registration is disabled, the first admin user must be created using the seed script:
```bash
node scripts/seed-admin.js
```

See the [Creating the First Admin User](#-creating-the-first-admin-user) section above for details.

### Field Restrictions
- **Employees** can only update: firstName, lastName, email, phone, skills
- **Admins** can update all user fields except password (use reset-password endpoint)
- Backend enforces all restrictions - clients cannot bypass them

### Account Disabling
- Disabled users (`isActive: false`) cannot login
- They receive `ACCOUNT_DISABLED` error code
- Only admins can enable/disable accounts

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify network connectivity if using remote MongoDB

### Authentication Issues
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration
- Ensure token is included in Authorization header: `Bearer <token>`

### Permission Denied (403)
- Verify user has the required role (ADMIN for admin endpoints)
- Check if account is active (`isActive: true`)

## 🔮 Future Enhancements

Potential features to consider:
- [ ] Password reset via email
- [ ] Email verification
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Two-factor authentication (2FA)
- [ ] File upload functionality
- [ ] Advanced search and filtering
- [ ] Pagination for list endpoints
- [ ] Caching with Redis
- [ ] WebSocket support for real-time updates

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review error messages and error codes
3. Check server logs for detailed error information
4. Verify request format matches documentation

## 🙏 Acknowledgments

- Express.js community
- MongoDB and Mongoose teams
- JWT.io for JWT standards

---

**Built with ❤️ for scalable and secure employee management**

