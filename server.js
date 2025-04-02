// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// // Serve static files from 'public' and 'assets' folders
// app.use(express.static("public"));
// app.use(express.static("assets"));

// // MongoDB Connection (Updated)
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // Schema & Model for FormData
// const FormDataSchema = new mongoose.Schema({
//     extraText: { type: String },
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     number: { type: String, required: true },
//     message: { type: String }
// });

// const FormData = mongoose.model("FormData", FormDataSchema);

// // Schema & Model for Newsletter Subscriptions
// const NewsletterSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true }
// });

// const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

// // POST API for Form Submission
// app.post("/submit", async (req, res) => {
//     try {
//         const { extraText, name, email, number, message } = req.body;
//         if (!name || !email || !number) {
//             return res.status(400).json({ success: false, message: "All fields are required!" });
//         }

//         const newEntry = new FormData({ extraText, name, email, number, message });
//         await newEntry.save();
//         res.status(201).json({ success: true, message: "Data stored successfully" });
//     } catch (error) {
//         console.error("❌ Error submitting form:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // POST API for Newsletter Subscription
// app.post("/subscribe", async (req, res) => {
//     try {
//         const { email } = req.body;
//         if (!email) {
//             return res.status(400).json({ success: false, message: "Email is required!" });
//         }

//         // Check if email already exists
//         const existingSubscriber = await Newsletter.findOne({ email });
//         if (existingSubscriber) {
//             return res.status(400).json({ success: false, message: "Email already subscribed!" });
//         }

//         const newSubscriber = new Newsletter({ email });
//         await newSubscriber.save();

//         res.status(201).json({ success: true, message: "Subscribed successfully!" });
//     } catch (error) {
//         console.error("❌ Error subscribing:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // Default Route
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/web1.html");
// });
// ;

// // Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// // Export for Vercel
// module.exports = app;





require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files from 'public' and 'assets' folders
app.use(express.static(__dirname + "/public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

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
        console.error("❌ Error submitting form:", error);
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
        console.error("❌ Error subscribing:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Routes for all static pages
const pages = [
    "appDevelopment",
    "branding",
    "contactUs",
    "contentCreation(Ads_Shoots)",
    "erpSystems",
    "freeConsultation",
    "getWebsiteNow",
    "Marketing",
    "SEO",
    "socialMedia",
    "web1"
];

pages.forEach((page) => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(__dirname + `/public/${page}.html`);
    });
});

// Default Route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/web1.html");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Export for Vercel
module.exports = app;

