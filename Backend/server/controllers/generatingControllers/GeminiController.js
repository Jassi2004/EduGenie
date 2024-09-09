const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const geminiFunction = async (prompt) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content using the model
        const result = await model.generateContent(prompt);
 
        // console.log("Full API Response:", result);

        // Accessing the generated text from the response object
        const generatedText = result.response?.candidates?.[0]?.content || "No text generated"; // Adjust based on actual API response format
        // console.log("Generated Text:", generatedText);

        return generatedText;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error; // Re-throw the error to be caught in the calling function
    }
};

module.exports = { geminiFunction };
