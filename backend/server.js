const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use("/api/auth", authRoutes); // Use auth routes for authentication

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
