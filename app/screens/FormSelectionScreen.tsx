import { FC, useMemo, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { ChipGroup, ChipOption } from "@/components/ChipGroup"
import { EmptyState } from "@/components/EmptyState"
import { FormTemplateCard } from "@/components/FormTemplateCard"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useFormEase } from "@/context/FormEaseContext"
import { categoryLabels, categoryOrder, formTemplates } from "@/data/formTemplates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { FormCategory, FormTemplate } from "@/types/formease"
import { useHeader } from "@/utils/useHeader"

interface FormSelectionScreenProps extends AppStackScreenProps<"FormSelection"> {}

type Filter = FormCategory | "all"

const FILTER_OPTIONS: ChipOption<Filter>[] = [
  { label: "All", value: "all" },
  ...categoryOrder.map((c) => ({ label: categoryLabels[c], value: c as Filter })),
]

export const FormSelectionScreen: FC<FormSelectionScreenProps> = function FormSelectionScreen({
  navigation,
  route,
}) {
  const { themed } = useAppTheme()
  const { startForm } = useFormEase()
  const [filter, setFilter] = useState<Filter>(route.params?.category ?? "all")

  useHeader({ title: "Choose a form", leftIcon: "back", onLeftPress: () => navigation.goBack() }, [
    navigation,
  ])

  const templates = useMemo(
    () => formTemplates.filter((t) => filter === "all" || t.category === filter),
    [filter],
  )

  function onSelect(template: FormTemplate) {
    const response = startForm(template.id)
    navigation.navigate("DynamicForm", { templateId: template.id, responseId: response.id })
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($content)}>
      <Text
        text="Pick the form you need. You can pause and come back any time."
        style={themed($intro)}
      />
      <View style={themed($filters)}>
        <ChipGroup options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
      </View>

      {templates.length === 0 ? (
        <EmptyState
          preset="generic"
          imageSource={null}
          heading="No forms in this category yet"
          content="Try another category to see available forms."
          button="Show all forms"
          buttonOnPress={() => setFilter("all")}
        />
      ) : (
        templates.map((template) => (
          <FormTemplateCard key={template.id} template={template} onPress={onSelect} />
        ))
      )}
    </Screen>
  )
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
})

const $intro: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $filters: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})
