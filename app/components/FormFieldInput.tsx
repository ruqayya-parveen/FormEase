import { KeyboardTypeOptions, TextStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { FormField } from "@/types/formease"

import { Button } from "./Button"
import { ChipGroup } from "./ChipGroup"
import { Text } from "./Text"
import { TextField } from "./TextField"
import { Checkbox } from "./Toggle/Checkbox"

export interface FormFieldInputProps {
  field: FormField
  value: string | undefined
  error?: string
  prefilled?: boolean
  onChange: (value: string) => void
  onExplain?: (field: FormField) => void
}

const keyboardFor: Partial<Record<FormField["type"], KeyboardTypeOptions>> = {
  email: "email-address",
  phone: "phone-pad",
  number: "numeric",
}

/**
 * Renders one field of a form template based on its `type`.
 */
export function FormFieldInput(props: FormFieldInputProps) {
  const { field, value, error, prefilled, onChange, onExplain } = props
  const { themed } = useAppTheme()
  const label = field.required ? `${field.label} *` : field.label

  return (
    <View style={themed($wrapper)}>
      {field.type === "checkbox" ? (
        <Checkbox
          label={label}
          value={value === "true"}
          onValueChange={(v) => onChange(v ? "true" : "false")}
          status={error ? "error" : undefined}
          helper={error}
          accessibilityLabel={field.label}
        />
      ) : field.type === "select" ? (
        <View style={themed($selectGroup)}>
          <Text text={label} weight="medium" style={themed($selectLabel)} />
          <ChipGroup options={field.options ?? []} value={value} onChange={onChange} />
          {!!error && <Text text={error} size="xs" style={themed($error)} />}
        </View>
      ) : (
        <TextField
          label={label}
          value={value ?? ""}
          onChangeText={onChange}
          placeholder={field.placeholder}
          keyboardType={keyboardFor[field.type]}
          autoCapitalize={field.type === "email" ? "none" : "sentences"}
          autoCorrect={false}
          status={error ? "error" : undefined}
          helper={error}
        />
      )}

      {prefilled && !error && (
        <Text
          text="Pre-filled from your profile. You can edit it."
          size="xs"
          style={themed($note)}
        />
      )}
      {field.aiHelp && onExplain && (
        <Button
          text="Explain this field"
          preset="default"
          style={themed($explain)}
          textStyle={themed($explainText)}
          onPress={() => onExplain(field)}
          accessibilityLabel={`Explain the field ${field.label}`}
        />
      )}
    </View>
  )
}

const $wrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  gap: spacing.xxs,
})

const $selectGroup: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $selectLabel: ThemedStyle<TextStyle> = () => ({})

const $error: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})

const $note: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.success,
})

const $explain: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  minHeight: 36,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
  borderRadius: 999,
  borderColor: colors.palette.primary300,
  backgroundColor: colors.palette.primary100,
})

const $explainText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontSize: 13,
})
