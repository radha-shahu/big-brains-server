# MongoDB Direct Insert Query for First Admin User

## ⚠️ Important Note

**Recommended Approach**: Use the seed script (`node scripts/seed-admin.js`) instead of direct MongoDB insertion, as it properly hashes the password using the same method as the application.

If you prefer to insert directly into MongoDB, you'll need to hash the password first using bcrypt with cost factor 12.

## Option 1: Using Node.js Seed Script (Recommended)

```bash
node scripts/seed-admin.js
```

This script:
- ✅ Automatically hashes the password
- ✅ Generates employeeId
- ✅ Uses the same User model as the application
- ✅ Checks for existing admins

## Option 2: Direct MongoDB Insert (Alternative)

### Step 1: Generate Hashed Password

First, generate the hashed password using Node.js:

```javascript
// Run in Node.js REPL or create a temp file
const bcrypt = require("bcryptjs");

async function hashPassword() {
    const password = "temporary123";
    const hashed = await bcrypt.hash(password, 12);
    console.log("Hashed password:", hashed);
}

hashPassword();
```

Or use this one-liner:
```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('temporary123', 12).then(h=>console.log(h))"
```

### Step 2: Insert Admin User

Connect to MongoDB and run:

```javascript
// Connect to your database
use userdb

// Insert admin user (replace HASHED_PASSWORD with the output from Step 1)
db.users.insertOne({
    employeeId: "EMP-2025-0001",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "HASHED_PASSWORD_HERE", // Replace with hashed password from Step 1
    phone: "+1234567890",
    role: "ADMIN",
    designation: "System Administrator",
    department: "IT",
    skills: ["System Administration", "Node.js", "MongoDB"],
    dateOfJoining: ISODate("2025-01-15T00:00:00.000Z"),
    totalExperience: 5,
    location: "New York",
    isActive: true,
    isFirstLogin: true,
    createdAt: new Date(),
    updatedAt: new Date()
})
```

### Step 3: Verify

```javascript
// Check if admin was created
db.users.findOne({ email: "john@example.com" })

// Verify role
db.users.findOne({ role: "ADMIN" })
```

## Complete MongoDB Shell Script

Save this as `create-admin.mongo.js` and run with `mongosh userdb create-admin.mongo.js`:

```javascript
// Generate hashed password first using Node.js, then replace HASHED_PASSWORD below

const adminUser = {
    employeeId: "EMP-2025-0001",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "HASHED_PASSWORD_HERE", // ⚠️ Replace with actual hashed password
    phone: "+1234567890",
    role: "ADMIN",
    designation: "System Administrator",
    department: "IT",
    skills: ["System Administration", "Node.js", "MongoDB"],
    dateOfJoining: new Date("2025-01-15"),
    totalExperience: 5,
    location: "New York",
    isActive: true,
    isFirstLogin: true,
    createdAt: new Date(),
    updatedAt: new Date()
};

// Check if admin already exists
const existing = db.users.findOne({ email: adminUser.email });
if (existing) {
    print("Admin user already exists with email: " + adminUser.email);
    print("Employee ID: " + existing.employeeId);
} else {
    // Check if any admin exists
    const admins = db.users.find({ role: "ADMIN" }).toArray();
    if (admins.length > 0) {
        print("Admin users already exist:");
        admins.forEach(admin => {
            print("  - " + admin.email + " (" + admin.employeeId + ")");
        });
    } else {
        const result = db.users.insertOne(adminUser);
        if (result.insertedId) {
            print("✅ Admin user created successfully!");
            print("Employee ID: " + adminUser.employeeId);
            print("Email: " + adminUser.email);
            print("Password: temporary123 (change after first login)");
        }
    }
}
```

## Quick Hash Generator Script

Create `hash-password.js`:

```javascript
const bcrypt = require("bcryptjs");

const password = process.argv[2] || "temporary123";

bcrypt.hash(password, 12).then(hashed => {
    console.log("\nHashed password for MongoDB:");
    console.log(hashed);
    console.log("\nUse this in your MongoDB insert query.\n");
});
```

Run: `node scripts/hash-password.js [your-password]`

