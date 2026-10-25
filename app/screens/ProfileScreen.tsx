import { ComponentProps, FC, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { ChipGroup, ChipOption } from "@/components/ChipGroup"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useFormEase } from "@/context/FormEaseContext"
import { demoProfile, emptyProfile } from "@/data/demoProfile"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { EmploymentStatus, IncomeRange, UserProfile } from "@/types/formease"
import { useHeader } from "@/utils/useHeader"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

const EMPLOYMENT_OPTIONS: ChipOption<EmploymentStatus>[] = [
  { label: "Employed", value: "employed" },
  { label: "Self-employed", value: "self-employed" },
  { label: "Student", value: "student" },
  { label: "Retired", value: "retired" },
  { label: "Unemployed", value: "unemployed" },
]

const INCOME_OPTIONS: ChipOption<IncomeRange>[] = [
  { label: "Under $25k", value: "under-25k" },
  { label: "$25k–$50k", value: "25k-50k" },
  { label: "$50k–$100k", value: "50k-100k" },
  { label: "$100k–$200k", value: "100k-200k" },
  { label: "Over $200k", value: "over-200k" },
]

type Errors = Partial<Record<keyof UserProfile, string>>

function validate(profile: UserProfile): Errors {
  const errors: Errors = {}
  if (!profile.fullName.trim()) errors.fullName = "Enter your full name"
  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.dateOfBirth)) errors.dateOfBirth = "Use YYYY-MM-DD"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errors.email = "Enter a valid email"
  if (profile.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a valid phone number"
  if (!profile.address.trim()) errors.address = "Enter your street address"
  if (!profile.city.trim()) errors.city = "Enter your city"
  if (!profile.postalCode.trim()) errors.postalCode = "Enter your postal code"
  return errors
}

function labelFor<T extends string>(options: ChipOption<T>[], value?: T) {
  return options.find((o) => o.value === value)?.label ?? "Not provided"
}

export const ProfileScreen: FC<ProfileScreenProps> = function ProfileScreen({ navigation }) {
  const { themed } = useAppTheme()
  const { profile, saveProfile } = useFormEase()

  const [isEditing, setIsEditing] = useState(!profile)
  const [draft, setDraft] = useState<UserProfile>(profile ?? emptyProfile)
  const [errors, setErrors] = useState<Errors>({})
  const [justSaved, setJustSaved] = useState(false)

  useHeader(
    {
      title: "Your profile",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function onSave() {
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    saveProfile({ ...draft, fullName: draft.fullName.trim(), email: draft.email.trim() })
    setIsEditing(false)
    setJustSaved(true)
  }

  function onCancel() {
    setDraft(profile ?? emptyProfile)
    setErrors({})
    setIsEditing(false)
  }

  function field(
    key: Exclude<keyof UserProfile, "employmentStatus" | "annualIncomeRange">,
    label: string,
    extra: Partial<ComponentProps<typeof TextField>> = {},
  ) {
    return (
      <TextField
        label={label}
        value={draft[key]}
        onChangeText={(v) => update(key, v)}
        status={errors[key] ? "error" : undefined}
        helper={errors[key]}
        containerStyle={themed($field)}
        autoCorrect={false}
        {...extra}
      />
    )
  }

  if (!isEditing && profile) {
    const rows: [string, string][] = [
      ["Full name", profile.fullName],
      ["Date of birth", profile.dateOfBirth],
      ["Email", profile.email],
      ["Phone", profile.phone],
      ["Address", profile.address],
      ["City", profile.city],
      ["Postal code", profile.postalCode],
      ["Employment status", labelFor(EMPLOYMENT_OPTIONS, profile.employmentStatus)],
      ["Annual income range", labelFor(INCOME_OPTIONS, profile.annualIncomeRange)],
    ]
    return (
      <Screen preset="scroll" contentContainerStyle={themed($content)}>
        {justSaved && (
          <View style={themed($banner)} accessibilityLiveRegion="polite">
            <Text text="Profile saved. We'll use it to pre-fill your forms." size="sm" />
          </View>
        )}
        <View style={themed($summaryCard)}>
          {rows.map(([label, value]) => (
            <View key={label} style={themed($row)}>
              <Text text={label} size="xs" style={themed($dim)} />
              <Text text={value} />
            </View>
          ))}
        </View>
        <Button
          text="Edit profile"
          preset="reversed"
          style={themed($primaryButton)}
          onPress={() => {
            setJustSaved(false)
            setIsEditing(true)
          }}
        />
      </Screen>
    )
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={themed($content)}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        text="Used only to pre-fill forms on this device. Demo data is fictional."
        size="sm"
        style={themed($intro)}
      />
      <Button
        text="Load demo data"
        preset="default"
        style={themed($secondaryButton)}
        onPress={() => {
          setDraft(demoProfile)
          setErrors({})
        }}
      />

      {field("fullName", "Full name", { autoComplete: "name", autoCapitalize: "words" })}
      {field("dateOfBirth", "Date of birth", {
        placeholder: "YYYY-MM-DD",
        keyboardType: "numbers-and-punctuation",
        autoCapitalize: "none",
      })}
      {field("email", "Email", {
        autoComplete: "email",
        keyboardType: "email-address",
        autoCapitalize: "none",
      })}
      {field("phone", "Phone", { autoComplete: "tel", keyboardType: "phone-pad" })}
      {field("address", "Street address", { autoComplete: "street-address" })}
      {field("city", "City")}
      {field("postalCode", "Postal code", {
        autoComplete: "postal-code",
        autoCapitalize: "characters",
      })}

      <Text text="Employment status (optional)" weight="medium" style={themed($groupLabel)} />
      <ChipGroup
        options={EMPLOYMENT_OPTIONS}
        value={draft.employmentStatus}
        onChange={(v) => update("employmentStatus", v)}
      />

      <Text text="Annual income range (optional)" weight="medium" style={themed($groupLabel)} />
      <ChipGroup
        options={INCOME_OPTIONS}
        value={draft.annualIncomeRange}
        onChange={(v) => update("annualIncomeRange", v)}
      />

      <Button
        text="Save profile"
        preset="reversed"
        style={themed($primaryButton)}
        onPress={onSave}
      />
      {profile && (
        <Button
          text="Cancel"
          preset="default"
          style={themed($secondaryButton)}
          onPress={onCancel}
        />
      )}
    </Screen>
  )
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
})

const $intro: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginBottom: spacing.sm,
})

const $field: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $groupLabel: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
  marginBottom: spacing.xs,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 16,
  minHeight: 56,
  marginTop: spacing.lg,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: 16,
  minHeight: 48,
  marginBottom: spacing.md,
  backgroundColor: colors.palette.neutral100,
})

const $summaryCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  padding: spacing.md,
  gap: spacing.md,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxxs,
})

const $dim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $banner: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.successBackground,
  borderRadius: 12,
  padding: spacing.sm,
  marginBottom: spacing.md,
})
