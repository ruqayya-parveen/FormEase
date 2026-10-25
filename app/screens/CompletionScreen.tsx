import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { FormNotFound } from "@/components/FormNotFound"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useFormEase } from "@/context/FormEaseContext"
import { getTemplate } from "@/data/formTemplates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface CompletionScreenProps extends AppStackScreenProps<"Completion"> {}

export const CompletionScreen: FC<CompletionScreenProps> = function CompletionScreen({
  navigation,
  route,
}) {
  const { templateId, responseId } = route.params
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const { getResponse } = useFormEase()

  const template = getTemplate(templateId)
  const response = getResponse(responseId)

  if (!template || !response) {
    return <FormNotFound onGoHome={() => navigation.popToTop()} />
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={themed($content)}
    >
      <View style={themed($badge)} accessibilityElementsHidden importantForAccessibility="no">
        <Icon icon="check" size={36} color={colors.palette.neutral100} />
      </View>
      <Text text="Demo completed successfully." preset="heading" style={themed($title)} />
      <Text
        text={`${template.name}\nThis is a demo only. No actual banking, tax, payment or government application has been submitted.`}
        style={themed($body)}
      />
      {response.referenceNumber && (
        <View style={themed($reference)}>
          <Text text="Reference number" size="xs" style={themed($dim)} />
          <Text text={response.referenceNumber} preset="subheading" />
        </View>
      )}
      <Text
        text={`${response.prefilledFieldIds?.length ?? 0} fields were pre-filled from your profile.`}
        weight="medium"
        style={themed($prefilled)}
      />
      <Button
        text="Back to home"
        preset="reversed"
        style={themed($button)}
        onPress={() => navigation.popToTop()}
      />
    </Screen>
  )
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.success,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.lg,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $body: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.lg,
})

const $prefilled: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.success,
  textAlign: "center",
  marginBottom: spacing.xl,
})

const $dim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $reference: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.successBackground,
  borderRadius: 16,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  marginBottom: spacing.md,
})

const $button: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignSelf: "stretch",
  backgroundColor: colors.palette.primary500,
  borderRadius: 16,
  minHeight: 56,
})
