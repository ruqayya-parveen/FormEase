import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react"
import { useMMKVObject } from "react-native-mmkv"

import { getTemplate } from "@/data/formTemplates"
import type { FormResponse, UserProfile } from "@/types/formease"

export type FormEaseContextType = {
  profile?: UserProfile
  /** Newest first. */
  responses: FormResponse[]
  saveProfile: (profile: UserProfile) => void
  /** Creates a new in-progress response for a template and returns it. */
  startForm: (templateId: string) => FormResponse
  updateResponse: (responseId: string, patch: Partial<FormResponse>) => void
  /** Marks a response as completed and returns the reference number. */
  completeForm: (responseId: string) => string
  getResponse: (responseId: string) => FormResponse | undefined
}

export const FormEaseContext = createContext<FormEaseContextType | null>(null)

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function makeReferenceNumber() {
  return `FE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export const FormEaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useMMKVObject<UserProfile>("FormEase.profile")
  const [storedResponses, setResponses] = useMMKVObject<FormResponse[]>("FormEase.responses")
  const responses = useMemo(() => storedResponses ?? [], [storedResponses])

  const saveProfile = useCallback((next: UserProfile) => setProfile(next), [setProfile])

  const startForm = useCallback(
    (templateId: string) => {
      const now = new Date().toISOString()
      const answers: Record<string, string> = {}
      const prefilledFieldIds: string[] = []
      const template = getTemplate(templateId)
      for (const field of template?.sections.flatMap((section) => section.fields) ?? []) {
        const value = field.profileKey ? profile?.[field.profileKey] : undefined
        if (value) {
          answers[field.id] = value
          prefilledFieldIds.push(field.id)
        }
      }
      const response: FormResponse = {
        id: makeId("resp"),
        templateId,
        status: "in-progress",
        answers,
        prefilledFieldIds,
        currentStep: 0,
        startedAt: now,
        updatedAt: now,
      }
      setResponses([response, ...responses])
      return response
    },
    [profile, responses, setResponses],
  )

  const updateResponse = useCallback(
    (responseId: string, patch: Partial<FormResponse>) => {
      setResponses(
        responses.map((r) =>
          r.id === responseId ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r,
        ),
      )
    },
    [responses, setResponses],
  )

  const completeForm = useCallback(
    (responseId: string) => {
      const existing = responses.find((r) => r.id === responseId)
      const referenceNumber = existing?.referenceNumber ?? makeReferenceNumber()
      const now = new Date().toISOString()
      setResponses(
        responses.map((r) =>
          r.id === responseId
            ? { ...r, status: "completed", completedAt: now, updatedAt: now, referenceNumber }
            : r,
        ),
      )
      return referenceNumber
    },
    [responses, setResponses],
  )

  const getResponse = useCallback(
    (responseId: string) => responses.find((r) => r.id === responseId),
    [responses],
  )

  const value = {
    profile,
    responses,
    saveProfile,
    startForm,
    updateResponse,
    completeForm,
    getResponse,
  }

  return <FormEaseContext.Provider value={value}>{children}</FormEaseContext.Provider>
}

export const useFormEase = () => {
  const context = useContext(FormEaseContext)
  if (!context) throw new Error("useFormEase must be used within a FormEaseProvider")
  return context
}
