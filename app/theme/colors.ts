const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F5F8FC",
  neutral300: "#D5DCE8",
  neutral400: "#AAB4C5",
  neutral500: "#7C879B",
  neutral600: "#475569",
  neutral700: "#2B3548",
  neutral800: "#0F172A",
  neutral900: "#000000",

  primary100: "#DCE6FA",
  primary200: "#B4C8F0",
  primary300: "#7C9BDB",
  primary400: "#3F63B8",
  primary500: "#1E3A8A",
  primary600: "#15296B",

  secondary100: "#E3E8F2",
  secondary200: "#C5CEE0",
  secondary300: "#8F9DBD",
  secondary400: "#5B6B91",
  secondary500: "#374566",

  accent100: "#E0F5F1",
  accent200: "#B4E8DE",
  accent300: "#78D3C3",
  accent400: "#3BB8A4",
  accent500: "#0B7F6F",

  angry100: "#FBE3DC",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
  /**
   * Success / completion accents.
   */
  success: palette.accent500,
  successBackground: palette.accent100,
} as const
