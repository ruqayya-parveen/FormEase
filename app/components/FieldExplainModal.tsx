import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Modal, Pressable, TextStyle, View, ViewStyle } from "react-native"

import { explainField, ExplainFieldResult } from "@/services/api/ai"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { FormField } from "@/types/formease"

import { Button } from "./Button"
import { Text } from "./Text"

export interface FieldExplainModalProps {
  field?: FormField
  formType: string
  onClose: () => void
}

type State =
  | { status: "loading" }
  | { status: "ok"; data: ExplainFieldResult }
  | { status: "unavailable" | "error"; message: string }

/**
 * Bottom sheet that asks the Gemma-backed server to explain a single field.
 */
export function FieldExplainModal(props: FieldExplainModalProps) {
  const { field, formType, onClose } = props
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const [state, setState] = useState<State>({ status: "loading" })

  const load = useCallback(async () => {
    if (!field) return
    setState({ status: "loading" })
    const result = await explainField({
      formType,
      fieldLabel: field.label,
      fieldHelpText: field.helpText,
    })
    if (result.kind === "ok") setState({ status: "ok", data: result.data })
    else setState({ status: result.kind, message: result.message })
  }, [field, formType])

  useEffect(() => {
    load()
  }, [load])

  return (
    <Modal visible={!!field} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={themed($backdrop)}
        onPress={onClose}
        accessibilityLabel="Close explanation"
        accessibilityRole="button"
      />
      <View style={themed($sheet)}>
        <Text text={field?.label ?? ""} preset="subheading" />
        <Text text="AI explanation (Gemma)" size="xs" style={themed($dim)} />

        {state.status === "loading" && (
          <View style={themed($center)} accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.palette.primary500} />
            <Text text="Asking the AI…" style={themed($dim)} />
          </View>
        )}

        {state.status === "ok" && (
          <View style={themed($body)}>
            <Text text={state.data.explanation} />
            {!!state.data.example && (
              <View style={themed($example)}>
                <Text text="Example" size="xs" weight="semiBold" />
                <Text text={state.data.example} size="sm" />
              </View>
            )}
            <Text
              text="General information only. Not legal, tax or financial advice. Check official instructions."
              size="xs"
              style={themed($dim)}
            />
          </View>
        )}

        {(state.status === "unavailable" || state.status === "error") && (
          <View style={themed($body)} accessibilityLiveRegion="polite">
            <Text text={state.message} style={themed($error)} />
            <Button text="Try again" preset="default" style={themed($button)} onPress={load} />
          </View>
        )}

        <Button text="Close" preset="reversed" style={themed($closeButton)} onPress={onClose} />
      </View>
    </Modal>
  )
}

const $backdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.overlay50,
})

const $sheet: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: spacing.lg,
  paddingBottom: spacing.xl,
  gap: spacing.xs,
})

const $center: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.sm,
  paddingVertical: spacing.lg,
})

const $body: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  paddingVertical: spacing.sm,
})

const $example: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.successBackground,
  borderRadius: 12,
  padding: spacing.sm,
  gap: spacing.xxs,
})

const $dim: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $error: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})

const $button: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderRadius: 14,
  backgroundColor: colors.palette.neutral100,
})

const $closeButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 16,
  marginTop: spacing.sm,
})
