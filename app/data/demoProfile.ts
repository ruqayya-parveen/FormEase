import type { UserProfile } from "@/types/formease"

/** Fictional demo data. */
export const demoProfile: UserProfile = {
  fullName: "Alex Morgan",
  dateOfBirth: "1990-04-17",
  email: "alex.morgan@example.com",
  phone: "(555) 010-2345",
  address: "42 Maple Street, Apt 5B",
  city: "Springfield",
  postalCode: "12345",
  employmentStatus: "employed",
  annualIncomeRange: "50k-100k",
}

export const emptyProfile: UserProfile = {
  fullName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
}
