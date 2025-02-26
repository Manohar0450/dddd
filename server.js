require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: userMessage }] }],
    });

    const botResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
