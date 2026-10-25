const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#F5F8FC",
  neutral700: "#D5DCE8",
  neutral600: "#AAB4C5",
  neutral500: "#7C879B",
  neutral400: "#475569",
  neutral300: "#1B2740",
  neutral200: "#0B1220",
  neutral100: "#000000",

  primary600: "#DCE6FA",
  primary500: "#B4C8F0",
  primary400: "#7C9BDB",
  primary300: "#3F63B8",
  primary200: "#1E3A8A",
  primary100: "#15296B",

  secondary500: "#E3E8F2",
  secondary400: "#C5CEE0",
  secondary300: "#8F9DBD",
  secondary200: "#5B6B91",
  secondary100: "#374566",

  accent500: "#E0F5F1",
  accent400: "#B4E8DE",
  accent300: "#78D3C3",
  accent200: "#3BB8A4",
  accent100: "#0B7F6F",

  angry100: "#FBE3DC",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
  /**
   * Success / completion accents.
   */
  success: palette.accent100,
  successBackground: palette.accent500,
} as const
