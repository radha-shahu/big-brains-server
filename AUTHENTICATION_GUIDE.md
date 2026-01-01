# Authentication & Authorization Guide

## Overview
This guide explains the authentication and authorization system implemented in this backend service, including JWT authentication, role-based access control, and security best practices.

## 🔐 Authentication Flow

### 1. User Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ "email": "john@example.com", "password": "password123" }`
- **Response**: Returns JWT token and user data
- **Checks**: Validates credentials and checks if account is active

### 2. Accessing Protected Routes
- Include JWT token in Authorization header: `Authorization: Bearer <your-token>`
- **Example**: `GET /api/users/me` (Get current user profile)
- **Example**: `POST /api/admin/users` (Create user - Admin only)

### 3. Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Body**: `{ "currentPassword": "old123", "newPassword": "new123" }`
- **Access**: All authenticated users

## 👥 Role-Based Access Control (RBAC)

The system implements three roles with different permission levels:

### Roles

1. **ADMIN**
   - Full access to all endpoints
   - Can create, update, and manage users
   - Can create, update, and manage projects
   - Can disable/enable user accounts
   - Can reset user passwords

2. **EMPLOYEE**
   - Can view own profile
   - Can update own profile (restricted fields only)
   - Can view employee directory
   - Can view projects (read-only)
   - Cannot update role, designation, manager, projects, etc.

3. **MANAGER**
   - Similar to EMPLOYEE
   - Can be extended with additional permissions in the future

### Role Enforcement

All admin endpoints are protected by the `requireAdmin` middleware:

```javascript
// Example: Admin user management route
router.post("/", protect, requireAdmin, adminUserController.createUser);
```

## 🛡️ Security Features

### 1. Account Status Check

**Active Status Validation:**
- Login endpoint checks `isActive` status
- Protected routes check `isActive` status via `protect` middleware
- Disabled users receive `ACCOUNT_DISABLED` error code

**Error Response:**
```json
{
  "status": "fail",
  "message": "Your account has been disabled. Please contact administrator.",
  "errorCode": "ACCOUNT_DISABLED"
}
```

### 2. Password Security
- ✅ Passwords are hashed using bcrypt with cost factor of 12
- ✅ Minimum password length: 6 characters
- ✅ Password is never returned in API responses (`select: false`)
- ✅ Password hashing happens automatically before saving
- ✅ Users must provide current password to change password

### 3. JWT Token Security
- ✅ Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- ✅ Tokens are signed with a secret key
- ✅ Token is verified on every protected route request
- ✅ User existence and active status verified on each request

### 4. Field-Level Security

**Backend Enforces Restrictions:**
- Employees cannot update admin-only fields even if sent in request
- Admin cannot update certain fields (e.g., password via regular update endpoint)
- Auto-generated fields (employeeId, projectCode) cannot be set by clients

**Example:**
```javascript
// Employee tries to update role - backend ignores it
PATCH /api/users/me
{
  "firstName": "John",
  "role": "ADMIN"  // ❌ This will be ignored
}
```

### 5. Error Handling
- ✅ Generic error messages for invalid credentials (prevents user enumeration)
- ✅ Standardized error codes for programmatic handling
- ✅ Proper HTTP status codes (401 for unauthorized, 403 for forbidden)
- ✅ No sensitive information leaked in error messages

## 📁 File Structure

```
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js          # Authentication routes
│   │   ├── auth.controller.js      # Request handlers
│   │   ├── auth.service.js         # Business logic (login, changePassword)
│   │   └── auth.validation.js      # Input validation
│   │
│   └── admin/
│       ├── admin.user.routes.js     # Admin user management routes
│       ├── admin.user.controller.js # Admin user controllers
│       └── admin.user.service.js    # Admin user business logic
│
├── middlewares/
│   └── auth.middleware.js           # JWT verification & role checking
│
├── utils/
│   ├── jwt.js                       # JWT token generation and verification
│   └── errors.js                    # Custom error classes with error codes
│
└── constants/
    └── roles.js                     # Role constants (ADMIN, EMPLOYEE, MANAGER)
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

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

**⚠️ IMPORTANT**: 
- Never commit `.env` file to version control
- Use a strong, random secret for `JWT_SECRET` in production
- Use different secrets for dev/staging/prod environments

## 📝 API Endpoints

### Public Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "...",
      "employeeId": "EMP-2025-0001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "EMPLOYEE",
      "isActive": true
    }
  }
}
```

### Protected Endpoints (Require JWT Token)

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

#### Get Own Profile
```http
GET /api/users/me
Authorization: Bearer <your-jwt-token>
```

#### Update Own Profile (Restricted Fields)
```http
PATCH /api/users/me
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "skills": ["JavaScript", "Node.js"]
}
```

### Admin-Only Endpoints (Require ADMIN Role)

#### Create User
```http
POST /api/admin/users
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "temp123",
  "role": "EMPLOYEE",
  "designation": "Software Engineer"
}
```

#### Disable User
```http
PATCH /api/admin/users/:userId/status
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Reset User Password
```http
POST /api/admin/users/:userId/reset-password
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

## 🔧 How to Use in Frontend

### 1. Store Token After Login
```javascript
// After successful login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

if (response.ok) {
  // Save token for future requests
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  
  // Check if first login
  if (data.data.user.isFirstLogin) {
    // Redirect to change password page
    window.location.href = '/change-password';
  }
} else {
  // Handle errors
  if (data.errorCode === 'ACCOUNT_DISABLED') {
    alert('Your account has been disabled. Please contact administrator.');
  } else {
    alert(data.message);
  }
}
```

### 2. Include Token in Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Handle Token Expiration and Account Status
```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle different error types
    if (response.status === 401) {
      if (data.errorCode === 'ACCOUNT_DISABLED') {
        alert('Your account has been disabled. Please contact administrator.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (response.status === 403) {
      // Insufficient permissions
      alert('You do not have permission to perform this action.');
    } else {
      // Other errors
      alert(data.message || 'An error occurred');
    }
    
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}
```

### 4. Check User Role
```javascript
const user = JSON.parse(localStorage.getItem('user'));

if (user.role === 'ADMIN') {
  // Show admin dashboard
  // Enable admin features
} else {
  // Show employee dashboard
  // Hide admin features
}
```

## 🚀 Security Best Practices

### 1. Token Storage
- **Current**: Frontend stores token in localStorage
- **Better**: Use httpOnly cookies (more secure, prevents XSS attacks)
- **Alternative**: Use secure session storage

### 2. Token Refresh
- Consider implementing refresh tokens for better security
- Short-lived access tokens (15-30 min) + long-lived refresh tokens
- Rotate refresh tokens on use

### 3. Rate Limiting
- Add rate limiting to prevent brute force attacks
- Limit login attempts (e.g., 5 attempts per 15 minutes)
- Use packages like `express-rate-limit`

### 4. Password Policies
- Enforce stronger password requirements
- Require uppercase, lowercase, numbers, special characters
- Check against common password lists
- Implement password history (prevent reusing recent passwords)

### 5. Account Security
- Implement account lockout after failed login attempts
- Track login history and suspicious activity
- Send email notifications for security events (password changes, etc.)

### 6. HTTPS
- Always use HTTPS in production
- Never send tokens over unencrypted connections

### 7. CORS Configuration
- Configure CORS properly for production
- Only allow your frontend domain
- Don't use `*` in production

## 🧪 Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Change password (replace TOKEN)
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old123","newPassword":"new123"}'

# Create user as admin (replace TOKEN with admin token)
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "temp123",
    "role": "EMPLOYEE"
  }'
```

## ⚠️ Common Mistakes to Avoid

1. ❌ Storing JWT_SECRET in code (use environment variables)
2. ❌ Returning passwords in API responses
3. ❌ Using weak JWT secrets
4. ❌ Not validating input on server side
5. ❌ Not handling token expiration properly
6. ❌ Not checking account status (isActive) on protected routes
7. ❌ Allowing clients to update restricted fields
8. ❌ Not using HTTPS in production
9. ❌ Exposing user enumeration through error messages
10. ❌ Not implementing rate limiting on login endpoints

## 🔄 Next Steps

Consider implementing:
- [ ] Refresh tokens
- [ ] Password reset functionality (via email)
- [ ] Email verification
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Request logging
- [ ] Account lockout after failed attempts
- [ ] Session management
- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Two-Factor Authentication (2FA)
- [ ] Audit logging for admin actions

## 📚 Learning Resources

- [JWT.io](https://jwt.io/) - JWT debugger and information
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
