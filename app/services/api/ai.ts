import { create } from "apisauce"

import Config from "@/config"

export interface ExplainFieldRequest {
  formType: string
  fieldLabel: string
  fieldHelpText?: string
}

export interface ExplainFieldResult {
  explanation: string
  example: string
}

export type ExplainFieldResponse =
  | { kind: "ok"; data: ExplainFieldResult }
  | { kind: "unavailable"; message: string }
  | { kind: "error"; message: string }

const aiApi = create({
  baseURL: Config.AI_API_URL,
  timeout: 30000,
  headers: { "Accept": "application/json", "Content-Type": "application/json" },
})

/**
 * Asks the FormEase server for a plain-language explanation of a single field.
 * Only the form type, field label and field hint are sent. Never profile or answers.
 */
export async function explainField(body: ExplainFieldRequest): Promise<ExplainFieldResponse> {
  const response = await aiApi.post<ExplainFieldResult & { error?: string }>(
    "/api/ai/explain-field",
    body,
  )

  if (response.ok && response.data?.explanation) {
    return {
      kind: "ok",
      data: { explanation: response.data.explanation, example: response.data.example ?? "" },
    }
  }
  if (response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR") {
    return {
      kind: "unavailable",
      message: "AI help is unavailable right now (can't reach the FormEase server).",
    }
  }
  if (response.status === 503) {
    return {
      kind: "unavailable",
      message: "AI help is unavailable: the server has no Gemma API key configured.",
    }
  }
  return {
    kind: "error",
    message: response.data?.error ?? "Something went wrong while asking the AI.",
  }
}
