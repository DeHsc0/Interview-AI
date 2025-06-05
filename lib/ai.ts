import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import OpenAI from "openai";

export const model = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,  
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
}
)

export const embedder = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,  
    model: "text-embedding-004"
})