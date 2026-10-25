import type { FormCategory, FormField, FormTemplate } from "@/types/formease"

export const categoryLabels: Record<FormCategory, string> = {
  banking: "Banking",
  tax: "Tax & Finance",
  government: "Government Documents",
}

export const categoryDescriptions: Record<FormCategory, string> = {
  banking: "Accounts, loans and cards",
  tax: "Withholding, returns and credits",
  government: "IDs, passports and permits",
}

export const categoryOrder: FormCategory[] = ["banking", "tax", "government"]

const employmentOptions = [
  { label: "Employed", value: "employed" },
  { label: "Self-employed", value: "self-employed" },
  { label: "Student", value: "student" },
  { label: "Retired", value: "retired" },
  { label: "Unemployed", value: "unemployed" },
]

const incomeOptions = [
  { label: "Under $25k", value: "under-25k" },
  { label: "$25k–$50k", value: "25k-50k" },
  { label: "$50k–$100k", value: "50k-100k" },
  { label: "$100k–$200k", value: "100k-200k" },
  { label: "Over $200k", value: "over-200k" },
]

const nameField: FormField = {
  id: "fullName",
  label: "Full name",
  type: "text",
  required: true,
  profileKey: "fullName",
  helpText: "Your name as it appears on your official ID.",
}
const emailField: FormField = {
  id: "email",
  label: "Email",
  type: "email",
  required: true,
  profileKey: "email",
}
const phoneField: FormField = {
  id: "phone",
  label: "Phone",
  type: "phone",
  required: true,
  profileKey: "phone",
}
const addressFields = (prefix: string, label: string, prefill: boolean): FormField[] => [
  {
    id: `${prefix}Address`,
    label: `${label} street address`,
    type: "text",
    required: true,
    profileKey: prefill ? "address" : undefined,
  },
  {
    id: `${prefix}City`,
    label: `${label} city`,
    type: "text",
    required: true,
    profileKey: prefill ? "city" : undefined,
  },
  {
    id: `${prefix}PostalCode`,
    label: `${label} postal code`,
    type: "text",
    required: true,
    profileKey: prefill ? "postalCode" : undefined,
  },
]

// Simplified, clearly labeled demo templates. Not copies of any official form.
export const formTemplates: FormTemplate[] = [
  {
    id: "bank-account-application",
    name: "Bank Account Application",
    description: "Open a new checking or savings account with a personal bank (demo).",
    category: "banking",
    estimatedMinutes: 8,
    sections: [
      {
        id: "about",
        title: "About you",
        description: "We pre-filled these from your profile. Edit anything that's wrong.",
        fields: [nameField, emailField, phoneField],
      },
      {
        id: "account",
        title: "Account & income",
        fields: [
          {
            id: "accountType",
            label: "Account type",
            type: "select",
            required: true,
            aiHelp: true,
            helpText: "Checking or savings account",
            options: [
              { label: "Checking", value: "checking" },
              { label: "Savings", value: "savings" },
              { label: "Joint checking", value: "joint" },
            ],
          },
          {
            id: "employmentStatus",
            label: "Employment status",
            type: "select",
            required: true,
            profileKey: "employmentStatus",
            aiHelp: true,
            helpText: "Your current employment situation",
            options: employmentOptions,
          },
          {
            id: "annualIncome",
            label: "Annual income",
            type: "select",
            required: true,
            profileKey: "annualIncomeRange",
            aiHelp: true,
            helpText: "Enter your annual income",
            options: incomeOptions,
          },
        ],
      },
      {
        id: "address",
        title: "Address",
        fields: addressFields("home", "Home", true),
      },
      {
        id: "declaration",
        title: "Declaration",
        fields: [
          {
            id: "declaration",
            label: "I confirm the information above is accurate (demo).",
            type: "checkbox",
            required: true,
            aiHelp: true,
            helpText: "Declaration that the information provided is true",
          },
        ],
      },
    ],
  },
  {
    id: "tax-withholding-form",
    name: "Tax Preparation Basics",
    description: "A simplified demo form to gather income and deduction details for a tax year.",
    category: "tax",
    estimatedMinutes: 10,
    sections: [
      {
        id: "about",
        title: "About you",
        fields: [nameField, emailField],
      },
      {
        id: "income",
        title: "Year & income",
        fields: [
          {
            id: "financialYear",
            label: "Financial year",
            type: "select",
            required: true,
            aiHelp: true,
            helpText: "The tax year this form covers",
            options: [
              { label: "2024", value: "2024" },
              { label: "2025", value: "2025" },
            ],
          },
          {
            id: "incomeSources",
            label: "Income sources",
            type: "text",
            required: true,
            placeholder: "e.g. salary, freelance, interest",
            aiHelp: true,
            helpText: "Where your income came from during the year",
          },
        ],
      },
      {
        id: "deductions",
        title: "Deductions",
        fields: [
          {
            id: "deductions",
            label: "Eligible deductions",
            type: "text",
            placeholder: "e.g. charitable donations, education costs",
            aiHelp: true,
            helpText: "Expenses that may reduce taxable income",
          },
        ],
      },
      {
        id: "declaration",
        title: "Declaration",
        fields: [
          {
            id: "declaration",
            label: "I confirm the information above is accurate (demo).",
            type: "checkbox",
            required: true,
            aiHelp: true,
            helpText: "Declaration that the information provided is true",
          },
        ],
      },
    ],
  },
  {
    id: "passport-renewal",
    name: "Government ID Application",
    description: "A simplified demo application for a government-issued document.",
    category: "government",
    estimatedMinutes: 12,
    sections: [
      {
        id: "about",
        title: "About you",
        fields: [nameField, emailField, phoneField],
      },
      {
        id: "document",
        title: "Document",
        fields: [
          {
            id: "documentType",
            label: "Document type",
            type: "select",
            required: true,
            aiHelp: true,
            helpText: "Which document you are applying for",
            options: [
              { label: "Passport", value: "passport" },
              { label: "National ID card", value: "id-card" },
              { label: "Driving permit", value: "permit" },
            ],
          },
        ],
      },
      {
        id: "addresses",
        title: "Addresses",
        fields: [
          ...addressFields("current", "Current", true),
          {
            id: "permanentAddress",
            label: "Permanent address",
            type: "text",
            required: true,
            aiHelp: true,
            helpText: "The address registered as your long-term home",
          },
        ],
      },
      {
        id: "supporting",
        title: "Supporting documents",
        description: "Tick the documents you have ready.",
        fields: [
          {
            id: "docProofOfId",
            label: "Proof of identity",
            type: "checkbox",
            aiHelp: true,
            helpText: "A document that proves who you are",
          },
          { id: "docProofOfAddress", label: "Proof of address", type: "checkbox", aiHelp: true },
          { id: "docPhoto", label: "Recent passport-style photo", type: "checkbox" },
        ],
      },
    ],
  },
]

export function getTemplate(templateId: string): FormTemplate | undefined {
  return formTemplates.find((t) => t.id === templateId)
}
