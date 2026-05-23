import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { GoogleGenAI } from "@google/genai";


const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, "../.env") });

const getGeminiResponse = async (message) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    // Create the client only after the key check passes.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",  // model
        contents: message, // Input or Prompt
    });
    
    // Basically extract the output of the response and this is exactly what will be sent to the frontend
    return response.text;
}

export default getGeminiResponse;