import { TextStyle, View, ViewStyle } from "react-native"

import { categoryLabels } from "@/data/formTemplates"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { FormTemplate } from "@/types/formease"

import { Card } from "./Card"
import { StatusPill } from "./StatusPill"

export interface FormTemplateCardProps {
  template: FormTemplate
  onPress: (template: FormTemplate) => void
}

/**
 * A pressable card summarising a form template.
 */
export function FormTemplateCard(props: FormTemplateCardProps) {
  const { template, onPress } = props
  const { themed } = useAppTheme()

  return (
    <Card
      heading={template.name}
      content={template.description}
      style={themed($card)}
      headingStyle={themed($heading)}
      onPress={() => onPress(template)}
      accessibilityLabel={`${template.name}. ${template.description} About ${template.estimatedMinutes} minutes.`}
      accessibilityHint="Opens this form"
      FooterComponent={
        <View style={themed($chips)}>
          <StatusPill label={categoryLabels[template.category]} tone="primary" />
          <StatusPill label={`~${template.estimatedMinutes} min`} />
        </View>
      }
    />
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral300,
  borderRadius: 20,
  padding: spacing.md,
  marginBottom: spacing.md,
  shadowOpacity: 0.05,
  elevation: 3,
})

const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxs,
})

const $chips: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.xs,
  marginTop: spacing.sm,
})
