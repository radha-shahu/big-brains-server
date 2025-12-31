# JWT Authentication Guide

## Overview
This guide explains the JWT authentication system implemented in this backend service, along with best practices for secure authentication.

## 🔐 Authentication Flow

### 1. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- **Response**: Returns JWT token and user data

### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ "email": "john@example.com", "password": "password123" }`
- **Response**: Returns JWT token and user data

### 3. Accessing Protected Routes
- Include JWT token in Authorization header: `Authorization: Bearer <your-token>`
- **Example**: `GET /api/auth/me` (Get current user)
- **Example**: `GET /api/users/me/profile` (Get current user profile)

## 📁 File Structure

```
├── controllers/
│   └── authController.js    # Authentication logic (register, login, getMe)
├── middleware/
│   └── auth.js              # JWT verification middleware
├── models/
│   └── User.js              # User model with password hashing
├── routes/
│   └── authRoutes.js        # Authentication routes
└── utils/
    └── jwt.js               # JWT token generation and verification
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
- Consider using environment-specific secrets (different for dev/staging/prod)

## 🛡️ Security Best Practices

### 1. Password Security
- ✅ Passwords are hashed using bcrypt with cost factor of 12
- ✅ Minimum password length: 6 characters (consider increasing to 8+)
- ✅ Password is never returned in API responses (select: false)
- ✅ Password hashing happens automatically before saving

### 2. JWT Token Security
- ✅ Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- ✅ Tokens are signed with a secret key
- ✅ Token is verified on every protected route request
- ✅ User existence is verified on each request (user could be deleted)

### 3. Error Handling
- ✅ Generic error messages for invalid credentials (prevents user enumeration)
- ✅ Proper HTTP status codes (401 for unauthorized, 400 for bad requests)
- ✅ No sensitive information leaked in error messages

### 4. Request Validation
- ✅ Input validation on all endpoints
- ✅ Email format validation
- ✅ Required field checks

## 📝 API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Endpoints (Require JWT Token)

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

#### Get My Profile
```http
GET /api/users/me/profile
Authorization: Bearer <your-jwt-token>
```

## 🔧 How to Use in Frontend

### 1. Store Token After Login
```javascript
// After successful login/register
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token); // or use httpOnly cookies
```

### 2. Include Token in Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Handle Token Expiration
```javascript
if (response.status === 401) {
  // Token expired or invalid
  localStorage.removeItem('token');
  // Redirect to login
}
```

## 🚀 Additional Best Practices to Consider

### 1. Token Storage
- **Current**: Frontend stores token in localStorage
- **Better**: Use httpOnly cookies (more secure, prevents XSS attacks)
- **Alternative**: Use secure session storage

### 2. Token Refresh
- Implement refresh tokens for better security
- Short-lived access tokens (15-30 min) + long-lived refresh tokens
- Rotate refresh tokens on use

### 3. Rate Limiting
- Add rate limiting to prevent brute force attacks
- Limit login attempts (e.g., 5 attempts per 15 minutes)
- Use packages like `express-rate-limit`

### 4. Password Reset
- Implement password reset functionality
- Use secure tokens with expiration
- Send reset links via email

### 5. Email Verification
- Verify email addresses before allowing login
- Send verification emails
- Track verification status in user model

### 6. Two-Factor Authentication (2FA)
- Add 2FA for enhanced security
- Use packages like `speakeasy` or `node-2fa`

### 7. CORS Configuration
- Configure CORS properly for production
- Only allow your frontend domain
- Don't use `*` in production

### 8. HTTPS
- Always use HTTPS in production
- Never send tokens over unencrypted connections

### 9. Logging and Monitoring
- Log authentication attempts (successful and failed)
- Monitor for suspicious activity
- Set up alerts for multiple failed login attempts

### 10. Password Policies
- Enforce stronger password requirements
- Require uppercase, lowercase, numbers, special characters
- Check against common password lists

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman/Thunder Client
1. Register or login to get a token
2. Copy the token from response
3. Add header: `Authorization: Bearer <token>`
4. Make requests to protected endpoints

## 📚 Learning Resources

- [JWT.io](https://jwt.io/) - JWT debugger and information
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## ⚠️ Common Mistakes to Avoid

1. ❌ Storing JWT_SECRET in code (use environment variables)
2. ❌ Returning passwords in API responses
3. ❌ Using weak JWT secrets
4. ❌ Not validating input on server side
5. ❌ Not handling token expiration properly
6. ❌ Using GET requests for sensitive operations
7. ❌ Not using HTTPS in production
8. ❌ Exposing user enumeration through error messages

## 🔄 Next Steps

Consider implementing:
- [ ] Refresh tokens
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Request logging
- [ ] Account lockout after failed attempts
- [ ] Session management
- [ ] OAuth integration (Google, GitHub, etc.)

