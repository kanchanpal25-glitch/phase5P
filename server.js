
require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

app.post("/ask", async (req, res) => {
  try {
    const question = req.body?.question?.trim();

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key is missing. Check Render Environment settings."
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question
    });

    res.json({
      answer: result.text || "No answer generated. Please try again."
    });

  } catch (error) {
    console.error("Gemini error:", error.message);

    const message = error.message || "";

    if (message.includes("503") ||
        message.includes("UNAVAILABLE")) {
      return res.status(503).json({
        error: "Gemini is busy right now. Please try again later."
      });
    }

    if (message.includes("API key") ||
        message.includes("401") ||
        message.includes("403")) {
      return res.status(500).json({
        error: "API key invalid or access denied. Check your Gemini API key."
      });
    }

    res.status(500).json({
      error: "AI could not answer. Please try again."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
