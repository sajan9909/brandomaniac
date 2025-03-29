require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Schema & Model for FormData
const FormDataSchema = new mongoose.Schema({
    extraText: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    message: { type: String }
});
const FormData = mongoose.model("FormData", FormDataSchema);

// Schema & Model for Newsletter Subscriptions
const NewsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});
const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

// POST API for Form Submission
app.post("/api/submit", async (req, res) => {
    try {
        const { extraText, name, email, number, message } = req.body;
        if (!name || !email || !number) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const newEntry = new FormData({ extraText, name, email, number, message });
        await newEntry.save();
        res.status(201).json({ success: true, message: "Data stored successfully" });
    } catch (error) {
        console.error("❌ Error in /submit:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST API for Newsletter Subscription
app.post("/api/subscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }

        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: "Email already subscribed!" });
        }

        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(201).json({ success: true, message: "Subscribed successfully!" });
    } catch (error) {
        console.error("❌ Error in /subscribe:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// API Health Check
app.get("/api", (req, res) => {
    res.json({ success: true, message: "✅ API is working!" });
});

// Catch-All Route to Serve Frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "web1.html"));  // Change "web1.html" if needed
});

// Export the app for Vercel
module.exports = app;
