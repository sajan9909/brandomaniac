require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

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
app.post("/submit", async (req, res) => {
    try {
        const { extraText, name, email, number, message } = req.body;
        if (!name || !email || !number) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const newEntry = new FormData({ extraText, name, email, number, message });
        await newEntry.save();
        res.status(201).json({ success: true, message: "Data stored successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST API for Newsletter Subscription
app.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: "Email already subscribed!" });
        }

        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(201).json({ success: true, message: "Subscribed successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
