const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/env");

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

