import { ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { EmptyState } from "./EmptyState"
import { Screen } from "./Screen"

export interface FormNotFoundProps {
  onGoHome: () => void
}

/**
 * Error state shown when a template or response can't be found (for example, a stale deep link).
 */
export function FormNotFound(props: FormNotFoundProps) {
  const { themed } = useAppTheme()

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={themed($center)}
    >
      <EmptyState
        preset="generic"
        heading="We couldn't find that form"
        content="It may have been removed. Head back home to start a new one."
        button="Back to home"
        buttonOnPress={props.onGoHome}
      />
    </Screen>
  )
}

const $center: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})
