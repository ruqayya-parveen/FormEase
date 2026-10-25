import express from "express"
import { GoogleGenAI } from "@google/genai"

const PORT = process.env.PORT || 3000
const MODEL = process.env.GEMMA_MODEL || "gemma-4-31b-it"
const apiKey = process.env.GEMINI_API_KEY
const ai = apiKey ? new GoogleGenAI({ apiKey }) : undefined

const app = express()
app.use(express.json({ limit: "10kb" }))

// Allow the Expo web dev server (localhost only) to call this API from the browser.
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    res.setHeader("Vary", "Origin")
  }
  if (req.method === "OPTIONS") return res.sendStatus(204)
  next()
})

app.get("/health", (_req, res) => res.json({ ok: true, aiConfigured: !!ai, model: MODEL }))

const clip = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "")

app.post("/api/ai/explain-field", async (req, res) => {
  const formType = clip(req.body?.formType, 40)
  const fieldLabel = clip(req.body?.fieldLabel, 120)
  const fieldHelpText = clip(req.body?.fieldHelpText, 300)
  if (!formType || !fieldLabel) {
    return res.status(400).json({ error: "formType and fieldLabel are required" })
  }
  if (!ai) {
    return res.status(503).json({ error: "AI is not configured on the server (missing GEMINI_API_KEY)." })
  }

  // Gemma models don't accept a separate system instruction, so the rules live in the prompt.
  const prompt = [
    "You help people understand terms on a simplified demo form.",
    "Explain the form field below in plain language (max 2 short sentences), then give one generic, illustrative example.",
    "Rules: do not invent official requirements, deadlines or legal rules. Do not give tax, legal or financial advice. If unsure, say the user should check the official instructions.",
    'Reply with ONLY a JSON object: {"explanation": string, "example": string}.',
    "",
    `Form type: ${formType}`,
    `Field label: ${fieldLabel}`,
    `Field hint: ${fieldHelpText || "none"}`,
  ].join("\n")

  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { temperature: 0.3, maxOutputTokens: 1024 },
    })
    const text = (result.text ?? "").trim()
    const json = text.match(/\{[\s\S]*\}/)?.[0]
    let parsed
    try {
      parsed = json ? JSON.parse(json) : undefined
    } catch {
      parsed = undefined
    }
    if (parsed?.explanation) {
      return res.json({ explanation: String(parsed.explanation), example: String(parsed.example ?? "") })
    }
    if (text) return res.json({ explanation: text, example: "" })
    return res.status(502).json({ error: "The model returned an empty response." })
  } catch (err) {
    console.error("Gemma request failed:", err?.message ?? err)
    return res.status(502).json({ error: "The AI service request failed. Check the model ID and API key." })
  }
})

app.listen(PORT, () => {
  console.log(`FormEase server on :${PORT} (model: ${MODEL}, ai: ${ai ? "configured" : "NOT configured"})`)
})
