// Contrast ratios (WCAG) noted against white unless stated.
export const colors = {
  /** Brand green. 2.9:1 on white — use for accents/borders only, never for text. */
  brand: '#1FAE5B',
  /** Button backgrounds and green text. 5.6:1 with white. */
  primary: '#13773E',
  primaryPressed: '#0F6B37',
  primarySoft: '#E8F6EE',

  background: '#F4FAF6',
  surface: '#FFFFFF',
  border: '#C9DDD0',

  /** 14.9:1 */
  text: '#1A2B22',
  /** 7.0:1 */
  textMuted: '#4B5D53',
  textOnPrimary: '#FFFFFF',

  /** 6.6:1 */
  danger: '#B42318',
  warningSoft: '#FFF6E0',
  warningBorder: '#E8C26A',
} as const;
