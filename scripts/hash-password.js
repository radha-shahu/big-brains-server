/**
 * Password Hash Generator
 * 
 * Generates a bcrypt hash for a password (cost factor 12)
 * Useful for direct MongoDB insertion
 * 
 * Usage: node scripts/hash-password.js [password]
 */

const bcrypt = require("bcryptjs");

const password = process.argv[2] || "temporary123";

if (!password) {
    console.error("❌ Please provide a password");
    console.log("Usage: node scripts/hash-password.js [password]");
    process.exit(1);
}

bcrypt.hash(password, 12)
    .then(hashed => {
        console.log("\n✅ Password Hash Generated:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(hashed);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n📝 Use this hash in your MongoDB insert query.");
        console.log("⚠️  Remember: The seed script (seed-admin.js) is recommended over direct MongoDB insertion.\n");
    })
    .catch(error => {
        console.error("❌ Error hashing password:", error.message);
        process.exit(1);
    });

