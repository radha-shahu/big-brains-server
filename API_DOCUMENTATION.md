# API Documentation

## Base Information

- **Base URL**: `http://localhost:3000/api`
- **API Version**: 1.0.0
- **Content-Type**: `application/json`

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is obtained after successful registration or login and should be included in all subsequent protected requests.

---

## Authentication Endpoints

### 1. Register User

Register a new user account.

- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Creates a new user account and returns a JWT token for authentication

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Request Body Schema
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| name | string | Yes | - | User's full name |
| email | string | Yes | Valid email format, unique | User's email address |
| password | string | Yes | Minimum 6 characters | User's password (will be hashed) |

#### Success Response

**Status Code**: `201 Created`

**Response Body**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| status | string | Response status ("success") |
| message | string | Success message |
| token | string | JWT token for authentication (save this for future requests) |
| data.user._id | string | Unique user identifier |
| data.user.name | string | User's name |
| data.user.email | string | User's email |
| data.user.createdAt | string (ISO 8601) | Account creation timestamp |
| data.user.updatedAt | string (ISO 8601) | Last update timestamp |

#### Error Responses

**Status Code**: `400 Bad Request`

**Scenario 1**: Missing required fields
```json
{
  "status": "fail",
  "message": "Name, email, and password are required"
}
```

**Scenario 2**: Password too short
```json
{
  "status": "fail",
  "message": "Password must be at least 6 characters"
}
```

**Scenario 3**: Email already exists
```json
{
  "status": "fail",
  "message": "User with this email already exists"
}
```

**Scenario 4**: Invalid email format
```json
{
  "status": "fail",
  "message": "Invalid input data: Please provide a valid email"
}
```

**Status Code**: `422 Unprocessable Entity`

**Scenario**: Validation errors (Mongoose validation)
```json
{
  "status": "fail",
  "message": "Invalid input data: Name is required. Email is required."
}
```

**Status Code**: `500 Internal Server Error`

**Scenario**: Server error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

#### Example Request (cURL)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Example Request (JavaScript/Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (response.ok) {
  // Save token for future requests
  localStorage.setItem('token', data.token);
  console.log('User registered:', data.data.user);
} else {
  console.error('Error:', data.message);
}
```

---

### 2. Login User

Authenticate an existing user and receive a JWT token.

- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates user credentials and returns a JWT token

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

#### Success Response

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| status | string | Response status ("success") |
| message | string | Success message |
| token | string | JWT token for authentication (save this for future requests) |
| data.user._id | string | Unique user identifier |
| data.user.name | string | User's name |
| data.user.email | string | User's email |
| data.user.createdAt | string (ISO 8601) | Account creation timestamp |
| data.user.updatedAt | string (ISO 8601) | Last update timestamp |

#### Error Responses

**Status Code**: `400 Bad Request`

**Scenario**: Missing required fields
```json
{
  "status": "fail",
  "message": "Email and password are required"
}
```

**Status Code**: `401 Unauthorized`

**Scenario**: Invalid credentials (email doesn't exist or password is incorrect)
```json
{
  "status": "fail",
  "message": "Invalid email or password"
}
```

**Note**: The API returns the same error message for both "user not found" and "incorrect password" to prevent user enumeration attacks.

**Status Code**: `500 Internal Server Error`

**Scenario**: Server error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

#### Example Request (cURL)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Example Request (JavaScript/Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (response.ok) {
  // Save token for future requests
  localStorage.setItem('token', data.token);
  console.log('Login successful:', data.data.user);
} else {
  console.error('Error:', data.message);
}
```

---

### 3. Get Current User

Get the currently authenticated user's information.

- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (Requires Authentication)
- **Description**: Returns the user information for the authenticated user based on the JWT token

#### Request Headers
```
Authorization: Bearer <your-jwt-token>
```

#### Request Body
None

#### Query Parameters
None

#### Success Response

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| status | string | Response status ("success") |
| data.user._id | string | Unique user identifier |
| data.user.name | string | User's name |
| data.user.email | string | User's email |
| data.user.createdAt | string (ISO 8601) | Account creation timestamp |
| data.user.updatedAt | string (ISO 8601) | Last update timestamp |

#### Error Responses

**Status Code**: `401 Unauthorized`

**Scenario 1**: No token provided
```json
{
  "status": "fail",
  "message": "You are not logged in! Please log in to get access."
}
```

**Scenario 2**: Invalid or expired token
```json
{
  "status": "fail",
  "message": "Invalid or expired token. Please log in again."
}
```

**Scenario 3**: User no longer exists (user was deleted after token was issued)
```json
{
  "status": "fail",
  "message": "The user belonging to this token no longer exists."
}
```

**Status Code**: `500 Internal Server Error`

**Scenario**: Server error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

#### Example Request (cURL)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Request (JavaScript/Fetch)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (response.ok) {
  console.log('Current user:', data.data.user);
} else {
  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    localStorage.removeItem('token');
    // Redirect to login page
  }
  console.error('Error:', data.message);
}
```

---

## Common Response Structure

### Success Response Format
All successful responses follow this structure:
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
All error responses follow this structure:
```json
{
  "status": "fail" | "error",
  "message": "Error message describing what went wrong"
}
```

**Note**: In development mode, error responses may include a `stack` field with stack trace information.

---

## HTTP Status Codes

| Status Code | Meaning | When It's Used |
|-------------|---------|----------------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Invalid input, missing required fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side error |

---

## Error Handling Best Practices

### Client-Side Error Handling

1. **Check Response Status**: Always check `response.ok` or `response.status` before processing data
2. **Handle 401 Errors**: When receiving 401, remove stored token and redirect to login
3. **Display User-Friendly Messages**: Use the `message` field from error responses to show users what went wrong
4. **Retry Logic**: Consider implementing retry logic for 500 errors
5. **Token Refresh**: Monitor token expiration and implement refresh logic if needed

### Example Error Handling
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
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    
    // Throw error with message from API
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}
```

---

## JWT Token Information

### Token Structure
JWT tokens contain:
- **Payload**: User ID (`userId`)
- **Expiration**: Default 7 days (configurable via `JWT_EXPIRES_IN` environment variable)
- **Algorithm**: HS256 (HMAC SHA-256)

### Token Storage Recommendations

1. **Browser Storage Options**:
   - `localStorage`: Persists across sessions, accessible to JavaScript (current implementation)
   - `sessionStorage`: Cleared when tab closes, accessible to JavaScript
   - `httpOnly Cookies`: Most secure, not accessible to JavaScript (recommended for production)

2. **Security Considerations**:
   - Never store tokens in plain text
   - Use HTTPS in production
   - Implement token refresh mechanism
   - Clear tokens on logout

### Token Usage
Include the token in the `Authorization` header for all protected endpoints:
```
Authorization: Bearer <token>
```

---

## Testing the API

### Using Postman/Thunder Client

1. **Register/Login**:
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register` or `/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body: JSON with required fields
   - Copy the `token` from response

2. **Access Protected Endpoints**:
   - Method: GET
   - URL: `http://localhost:3000/api/auth/me`
   - Headers: 
     - `Authorization: Bearer <your-token>`
     - `Content-Type: application/json`

### Using cURL

See examples in each endpoint section above.

### Using JavaScript

See examples in each endpoint section above.

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting for production to prevent:
- Brute force attacks on login endpoints
- API abuse
- DDoS attacks

---

## Support

For issues or questions:
1. Check the error message in the response
2. Verify request format matches documentation
3. Ensure token is valid and not expired
4. Check server logs for detailed error information

---

## Changelog

### Version 1.0.0
- Initial API release
- User registration endpoint
- User login endpoint
- Get current user endpoint
- JWT authentication

