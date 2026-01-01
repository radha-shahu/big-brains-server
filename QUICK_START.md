# Quick Start Guide

Get your Big Brains Server up and running in minutes!

## 🚀 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/userdb
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod
```

### 4. Create First Admin User
```bash
node scripts/seed-admin.js
```

**Output:**
```
🌱 Starting admin user seed...
✅ Connected to MongoDB
✅ Generated Employee ID: EMP-2025-0001
✅ Admin user created successfully!

📋 Admin User Details:
   Employee ID: EMP-2025-0001
   Name: John Doe
   Email: john@example.com
   Role: ADMIN
   Password: temporary123 (change this after first login)
```

### 5. Start the Server
```bash
npm run dev
```

### 6. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "temporary123"
  }'
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
      "email": "john@example.com",
      "role": "ADMIN"
    }
  }
}
```

### 7. Change Password (Recommended)
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "temporary123",
    "newPassword": "your-secure-password"
  }'
```

### 8. Create Your First Employee
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "temp123",
    "role": "EMPLOYEE",
    "designation": "Software Engineer",
    "department": "Engineering"
  }'
```

## ✅ You're All Set!

Now you can:
- Create more users via `/api/admin/users`
- Create projects via `/api/admin/projects`
- Manage users and projects through the admin endpoints

## 📚 Next Steps

- Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
- Check [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for auth details
- Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture

## 🆘 Troubleshooting

### "MongoDB connection error"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file

### "Admin user already exists"
- The seed script detected an existing admin
- Use existing admin credentials to login
- Or modify the email in `scripts/seed-admin.js`

### "401 Unauthorized" when creating users
- Make sure you're logged in and using the token
- Verify the token is in the Authorization header: `Bearer <token>`
- Check that your user has ADMIN role

