import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet()); // Adds basic security headers

// Validate API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env file");
  process.exit(1); // Exit process if API key is missing
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: message }] }],
    });

    const botResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received";

    res.json({ reply: botResponse });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Dynamic Port for Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
