import { FC, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { FormNotFound } from "@/components/FormNotFound"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useFormEase } from "@/context/FormEaseContext"
import { getTemplate } from "@/data/formTemplates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { displayValue, validateTemplate } from "@/utils/formValidation"
import { useHeader } from "@/utils/useHeader"

interface ReviewScreenProps extends AppStackScreenProps<"Review"> {}

export const ReviewScreen: FC<ReviewScreenProps> = function ReviewScreen({ navigation, route }) {
  const { templateId, responseId } = route.params
  const { themed } = useAppTheme()
  const { getResponse, updateResponse, completeForm } = useFormEase()
  const [showConfirmError, setShowConfirmError] = useState(false)

  const template = getTemplate(templateId)
  const response = getResponse(responseId)

  useHeader(
    {
      title: "Review",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  if (!template || !response) {
    return <FormNotFound onGoHome={() => navigation.popToTop()} />
  }

  const errors = validateTemplate(template, response.answers)
  const missingCount = Object.keys(errors).length
  const confirmed = !!response.confirmed

  function editSection(index: number) {
    updateResponse(responseId, { currentStep: index })
    navigation.goBack()
  }

  function onSubmit() {
    if (missingCount > 0) return
    if (!confirmed) {
      setShowConfirmError(true)
      return
    }
    completeForm(responseId)
    navigation.navigate("Completion", { templateId, responseId })
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($content)}>
      <Text text={template.name} preset="heading" style={themed($title)} />
      <Text
        text="Check your answers before you finish. This is a demo: nothing is sent anywhere."
        style={themed($dim)}
      />

      {missingCount > 0 && (
        <View style={themed($warning)} accessibilityLiveRegion="polite">
          <Text
            text={`${missingCount} required ${missingCount === 1 ? "field is" : "fields are"} missing or invalid. Fix ${missingCount === 1 ? "it" : "them"} to continue.`}
            size="sm"
            style={themed($errorText)}
          />
        </View>
      )}

      {template.sections.map((section, index) => (
        <View key={section.id} style={themed($card)}>
          <View style={themed($cardHeader)}>
            <Text text={section.title} preset="subheading" />
            <Button
              text="Edit"
              preset="default"
              style={themed($editButton)}
              onPress={() => editSection(index)}
              accessibilityLabel={`Edit ${section.title}`}
            />
          </View>
          {section.fields.map((field) => {
            const error = errors[field.id]
            return (
              <View key={field.id} style={themed(error ? $rowError : $row)}>
                <Text text={field.label} size="xs" style={themed($dim)} />
                <Text text={displayValue(field, response.answers[field.id])} />
                {!!error && <Text text={error} size="xs" style={themed($errorText)} />}
              </View>
            )
          })}
        </View>
      ))}

      <View style={themed($confirm)}>
        <Checkbox
          label="I've reviewed my answers and want to complete this demo."
          value={confirmed}
          onValueChange={(v) => {
            setShowConfirmError(false)
            updateResponse(responseId, { confirmed: v })
          }}
          status={showConfirmError && !confirmed ? "error" : undefined}
          helper={showConfirmError && !confirmed ? "Please tick this box to continue" : undefined}
        />
      </View>

      <Button
        text="Complete demo"
        preset="reversed"
        disabled={missingCount > 0}
        style={themed($primaryButton)}
        onPress={onSubmit}
      />
      <Button
        text="Edit answers"
        preset="default"
        style={themed($secondaryButton)}
        onPress={() => editSection(0)}
      />
    </Screen>
  )
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $dim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})

const $warning: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.errorBackground,
  borderRadius: 12,
  padding: spacing.sm,
  marginTop: spacing.md,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  padding: spacing.md,
  gap: spacing.sm,
  marginTop: spacing.md,
})

const $cardHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $editButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  minHeight: 36,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.md,
  borderRadius: 999,
  backgroundColor: colors.palette.neutral100,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xxxs,
})

const $rowError: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  gap: spacing.xxxs,
  borderLeftWidth: 3,
  borderLeftColor: colors.error,
  paddingLeft: spacing.sm,
})

const $confirm: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 16,
  minHeight: 56,
  marginTop: spacing.lg,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  minHeight: 56,
  marginTop: spacing.sm,
})
