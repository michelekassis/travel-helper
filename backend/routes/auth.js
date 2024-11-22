const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Validation: Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Create a new user and save to the database
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        res.status(500).json({ error: "Registration failed." });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found." });

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

        // Create a JWT token with the user's ID as the payload
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send the token to the user
        res.json({ message: "Login successful.", token });
    } catch (err) {
        res.status(500).json({ error: "Login failed." });
    }
});

module.exports = router;
