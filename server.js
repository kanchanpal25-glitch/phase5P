
require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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
                error: "Gemini API key missing. Check your .env file."
            });
        }

        const result = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: question
        });

        res.json({
            answer: result.text || "No answer generated. Please try again."
        });

    } catch (error) {
        console.error("Gemini error:", error.message);

        res.status(500).json({
            error: "AI could not answer. Check your API key, model access, or try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
