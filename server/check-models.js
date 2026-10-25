// Lists Gemma models available to your key so you can set GEMMA_MODEL to a real ID.
import { GoogleGenAI } from "@google/genai"

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set (copy .env.example to .env).")
  process.exit(1)
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const pager = await ai.models.list()
for await (const m of pager) {
  if (m.name?.includes("gemma")) console.log(m.name.replace("models/", ""))
}
