import { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"
import { StatusPill } from "@/components/StatusPill"
import { Text } from "@/components/Text"
import { useFormEase } from "@/context/FormEaseContext"
import {
  categoryDescriptions,
  categoryLabels,
  categoryOrder,
  getTemplate,
} from "@/data/formTemplates"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { FormResponse } from "@/types/formease"
import { formatDate } from "@/utils/formatDate"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

const HOW_IT_WORKS = [
  { title: "Pick a form", body: "Choose a bank, tax or government form." },
  {
    title: "Answer in plain language",
    body: "We explain each question and pre-fill your profile.",
  },
  { title: "Review and finish", body: "Check everything once, then you're ready to apply." },
]

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen({ navigation }) {
  const { themed } = useAppTheme()
  const { responses } = useFormEase()
  const recent = responses.slice(0, 5)

  function openResponse(response: FormResponse) {
    const params = { templateId: response.templateId, responseId: response.id }
    if (response.status === "completed") {
      navigation.navigate("Completion", params)
    } else {
      navigation.navigate("DynamicForm", params)
    }
  }

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={themed($content)}
    >
      <View style={themed($topRow)}>
        <Text text="FormEase" preset="heading" style={themed($appName)} />
        <Button
          text="Profile"
          preset="default"
          style={themed($profileButton)}
          onPress={() => navigation.navigate("Profile")}
          accessibilityLabel="Open your profile"
        />
      </View>
      <Text text="Fill once. Apply with confidence." size="lg" style={themed($tagline)} />

      <Button
        text="Start a new form"
        preset="reversed"
        style={themed($primaryButton)}
        onPress={() => navigation.navigate("FormSelection")}
      />

      <Text text="Browse by category" preset="subheading" style={themed($sectionTitle)} />
      {categoryOrder.map((category) => (
        <Card
          key={category}
          heading={categoryLabels[category]}
          content={categoryDescriptions[category]}
          style={themed($categoryCard)}
          onPress={() => navigation.navigate("FormSelection", { category })}
          accessibilityLabel={`${categoryLabels[category]}. ${categoryDescriptions[category]}`}
          RightComponent={<Text text="›" size="xl" style={themed($chevron)} />}
        />
      ))}

      <Text text="Recent forms" preset="subheading" style={themed($sectionTitle)} />
      {recent.length === 0 ? (
        <EmptyState
          preset="generic"
          heading="No forms yet"
          content="Start a new form and your progress will show up here."
          imageSource={null}
          button="Start a new form"
          buttonOnPress={() => navigation.navigate("FormSelection")}
          style={themed($empty)}
        />
      ) : (
        recent.map((response) => {
          const template = getTemplate(response.templateId)
          const done = response.status === "completed"
          return (
            <Card
              key={response.id}
              heading={template?.name ?? "Unknown form"}
              style={themed($recentCard)}
              onPress={() => openResponse(response)}
              accessibilityLabel={`${template?.name ?? "Form"}, ${done ? "completed" : "in progress"}`}
              ContentComponent={
                <View style={themed($recentMeta)}>
                  <StatusPill
                    label={done ? "Completed" : "In progress"}
                    tone={done ? "success" : "primary"}
                  />
                  <Text
                    text={`Updated ${formatDate(response.updatedAt)}`}
                    size="xs"
                    style={themed($dim)}
                  />
                </View>
              }
            />
          )
        })
      )}

      <Text text="How it works" preset="subheading" style={themed($sectionTitle)} />
      <View style={themed($howCard)}>
        {HOW_IT_WORKS.map((step, index) => (
          <View key={step.title} style={themed($step)}>
            <View style={themed($stepBadge)}>
              <Text text={String(index + 1)} size="sm" weight="bold" style={themed($stepNumber)} />
            </View>
            <View style={$stepText}>
              <Text text={step.title} weight="semiBold" />
              <Text text={step.body} size="sm" style={themed($dim)} />
            </View>
          </View>
        ))}
      </View>
    </Screen>
  )
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  paddingBottom: spacing.xl,
})

const $topRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $appName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})

const $profileButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  minHeight: 40,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 999,
  backgroundColor: colors.palette.neutral100,
})

const $tagline: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
  marginBottom: spacing.lg,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 16,
  minHeight: 56,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  marginBottom: spacing.sm,
})

const $categoryCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral300,
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.sm,
  minHeight: 0,
  shadowOpacity: 0.04,
  elevation: 2,
  alignItems: "center",
})

const $chevron: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})

const $recentCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral300,
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.sm,
  minHeight: 0,
  shadowOpacity: 0.04,
  elevation: 2,
})

const $recentMeta: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.sm,
  marginTop: spacing.xs,
})

const $dim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $empty: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.lg,
})

const $howCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  padding: spacing.md,
  gap: spacing.md,
})

const $step: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  gap: spacing.sm,
})

const $stepBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.successBackground,
  alignItems: "center",
  justifyContent: "center",
})

const $stepNumber: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.success,
})

const $stepText: ViewStyle = { flex: 1 }
