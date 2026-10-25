import type { FormField, FormSection, FormTemplate } from "@/types/formease"

export type FieldErrors = Record<string, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateField(field: FormField, value: string | undefined): string | undefined {
  const v = (value ?? "").trim()
  if (field.type === "checkbox") {
    return field.required && v !== "true" ? "This must be ticked" : undefined
  }
  if (!v) return field.required ? "This field is required" : undefined
  if (field.type === "email" && !EMAIL_RE.test(v)) return "Enter a valid email address"
  if (field.type === "phone" && v.replace(/\D/g, "").length < 7) {
    return "Enter a valid phone number"
  }
  if (field.type === "number" && Number.isNaN(Number(v))) return "Enter a number"
  return undefined
}

export function validateSection(
  section: FormSection,
  answers: Record<string, string>,
): FieldErrors {
  const errors: FieldErrors = {}
  for (const field of section.fields) {
    const error = validateField(field, answers[field.id])
    if (error) errors[field.id] = error
  }
  return errors
}

export function validateTemplate(
  template: FormTemplate,
  answers: Record<string, string>,
): FieldErrors {
  return template.sections.reduce<FieldErrors>(
    (all, section) => ({ ...all, ...validateSection(section, answers) }),
    {},
  )
}

/** Display text for a stored answer (maps select values to labels). */
export function displayValue(field: FormField, value: string | undefined): string {
  if (field.type === "checkbox") return value === "true" ? "Yes" : "No"
  if (!value) return "—"
  return field.options?.find((o) => o.value === value)?.label ?? value
}
