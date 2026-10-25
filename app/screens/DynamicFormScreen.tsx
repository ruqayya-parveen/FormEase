import { FC, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { FieldExplainModal } from "@/components/FieldExplainModal"
import { FormFieldInput } from "@/components/FormFieldInput"
import { FormNotFound } from "@/components/FormNotFound"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useFormEase } from "@/context/FormEaseContext"
import { getTemplate } from "@/data/formTemplates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { FormField } from "@/types/formease"
import { FieldErrors, validateSection } from "@/utils/formValidation"
import { useHeader } from "@/utils/useHeader"

interface DynamicFormScreenProps extends AppStackScreenProps<"DynamicForm"> {}

export const DynamicFormScreen: FC<DynamicFormScreenProps> = function DynamicFormScreen({
  navigation,
  route,
}) {
  const { templateId, responseId } = route.params
  const { themed } = useAppTheme()
  const { getResponse, updateResponse } = useFormEase()

  const template = getTemplate(templateId)
  const response = getResponse(responseId)

  const [answers, setAnswers] = useState<Record<string, string>>(response?.answers ?? {})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [explainTarget, setExplainTarget] = useState<FormField | undefined>()

  const sections = template?.sections ?? []
  const step = Math.min(response?.currentStep ?? 0, Math.max(sections.length - 1, 0))
  const section = sections[step]
  const isLast = step === sections.length - 1

  useHeader(
    {
      title: template?.name ?? "Form",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation, template?.name],
  )

  if (!template || !response || !section) {
    return <FormNotFound onGoHome={() => navigation.popToTop()} />
  }

  function onChange(fieldId: string, value: string) {
    const next = { ...answers, [fieldId]: value }
    setAnswers(next)
    updateResponse(responseId, { answers: next })
    if (errors[fieldId]) setErrors(({ [fieldId]: _removed, ...rest }) => rest)
  }

  function goBack() {
    if (step === 0) {
      navigation.goBack()
    } else {
      setErrors({})
      updateResponse(responseId, { answers, currentStep: step - 1 })
    }
  }

  function goNext() {
    const found = validateSection(section, answers)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    if (isLast) {
      updateResponse(responseId, { answers })
      navigation.navigate("Review", { templateId, responseId })
    } else {
      updateResponse(responseId, { answers, currentStep: step + 1 })
    }
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={themed($content)}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        text={`Step ${step + 1} of ${sections.length}`}
        size="sm"
        style={themed($dim)}
        accessibilityLiveRegion="polite"
      />
      <View
        style={themed($progressRow)}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: sections.length, now: step + 1 }}
      >
        {sections.map((s, index) => (
          <View key={s.id} style={themed(index <= step ? $segmentActive : $segment)} />
        ))}
      </View>
      <Text text={section.title} preset="heading" style={themed($title)} />
      {!!section.description && <Text text={section.description} style={themed($description)} />}

      {section.fields.map((field) => (
        <FormFieldInput
          key={field.id}
          field={field}
          value={answers[field.id]}
          error={errors[field.id]}
          prefilled={response.prefilledFieldIds?.includes(field.id)}
          onChange={(v) => onChange(field.id, v)}
          onExplain={setExplainTarget}
        />
      ))}

      <View style={themed($actions)}>
        <Button text="Back" preset="default" style={[themed($button), $flex]} onPress={goBack} />
        <Button
          text={isLast ? "Review" : "Next"}
          preset="reversed"
          style={[themed($button), themed($primary), $flex]}
          onPress={goNext}
        />
      </View>

      <FieldExplainModal
        field={explainTarget}
        formType={template.category}
        onClose={() => setExplainTarget(undefined)}
      />
    </Screen>
  )
}

const $flex: ViewStyle = { flex: 1 }

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
})

const $dim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $progressRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.xs,
  marginTop: spacing.xs,
  marginBottom: spacing.lg,
})

const $segment: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  height: 6,
  borderRadius: 3,
  backgroundColor: colors.palette.neutral300,
})

const $segmentActive: ThemedStyle<ViewStyle> = (theme) => ({
  ...$segment(theme),
  backgroundColor: theme.colors.success,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $description: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginBottom: spacing.md,
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  marginTop: spacing.xl,
})

const $button: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderRadius: 16,
  minHeight: 56,
  backgroundColor: colors.palette.neutral100,
})

const $primary: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
})
