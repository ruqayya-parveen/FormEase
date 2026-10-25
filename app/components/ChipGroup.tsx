import { Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

export interface ChipOption<T extends string> {
  label: string
  value: T
}

export interface ChipGroupProps<T extends string> {
  options: ChipOption<T>[]
  /** Currently selected value. `undefined` means nothing is selected. */
  value?: T
  onChange: (value: T) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * A wrapping row of single-select chips.
 */
export function ChipGroup<T extends string>(props: ChipGroupProps<T>) {
  const { options, value, onChange, disabled, style: $styleOverride } = props
  const { themed } = useAppTheme()

  return (
    <View style={[themed($row), $styleOverride]} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            style={themed(selected ? $chipSelected : $chip)}
          >
            <Text
              text={option.label}
              size="sm"
              weight={selected ? "semiBold" : "normal"}
              style={themed(selected ? $labelSelected : $label)}
            />
          </Pressable>
        )
      })}
    </View>
  )
}

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.xs,
})

const $chip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  minHeight: 40,
  justifyContent: "center",
  paddingHorizontal: spacing.md,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  backgroundColor: colors.palette.neutral100,
})

const $chipSelected: ThemedStyle<ViewStyle> = (theme) => ({
  ...$chip(theme),
  borderColor: theme.colors.palette.primary500,
  backgroundColor: theme.colors.palette.primary500,
})

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $labelSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
