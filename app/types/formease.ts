export type FormCategory = "banking" | "tax" | "government"

export type EmploymentStatus = "employed" | "self-employed" | "student" | "retired" | "unemployed"

export type IncomeRange = "under-25k" | "25k-50k" | "50k-100k" | "100k-200k" | "over-200k"

export interface UserProfile {
  fullName: string
  /** ISO date, YYYY-MM-DD */
  dateOfBirth: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  employmentStatus?: EmploymentStatus
  annualIncomeRange?: IncomeRange
}

export type FormFieldType = "text" | "email" | "phone" | "date" | "number" | "select" | "checkbox"

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  /** Plain-language explanation shown to the user (and later used by the AI helper). */
  helpText?: string
  options?: FormFieldOption[]
  /** Profile key used to pre-fill this field. */
  profileKey?: keyof UserProfile
  /** Show an "Explain this field" AI button. */
  aiHelp?: boolean
}

export interface FormSection {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: FormCategory
  estimatedMinutes: number
  sections: FormSection[]
}

export type FormStatus = "in-progress" | "completed"

export interface FormResponse {
  id: string
  templateId: string
  status: FormStatus
  /** Map of FormField.id to the entered value. */
  answers: Record<string, string>
  /** Zero-based index of the current section. */
  currentStep: number
  startedAt: string
  updatedAt: string
  completedAt?: string
  referenceNumber?: string
  /** Field ids that were pre-filled from the profile. */
  prefilledFieldIds: string[]
  /** User ticked the final confirmation on the review screen. */
  confirmed?: boolean
}
