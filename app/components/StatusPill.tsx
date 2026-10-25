import { StyleProp, TextStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

type Tone = "success" | "neutral" | "primary"

export interface StatusPillProps {
  label: string
  tone?: Tone
  style?: StyleProp<ViewStyle>
}

/**
 * A small rounded label used for form status and metadata chips.
 */
export function StatusPill(props: StatusPillProps) {
  const { label, tone = "neutral", style: $styleOverride } = props
  const { themed } = useAppTheme()

  return (
    <View style={[themed($pill(tone)), $styleOverride]}>
      <Text text={label} size="xxs" weight="medium" style={themed($label(tone))} />
    </View>
  )
}

const $pill =
  (tone: Tone): ThemedStyle<ViewStyle> =>
  ({ colors, spacing }) => ({
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxxs,
    backgroundColor:
      tone === "success"
        ? colors.successBackground
        : tone === "primary"
          ? colors.palette.primary100
          : colors.palette.neutral300,
  })

const $label =
  (tone: Tone): ThemedStyle<TextStyle> =>
  ({ colors }) => ({
    color:
      tone === "success"
        ? colors.success
        : tone === "primary"
          ? colors.palette.primary500
          : colors.palette.neutral700,
  })
