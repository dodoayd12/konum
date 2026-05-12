/** Konum — design tokens (iOS-first) */
export const KonumColors = {
  canvas: '#0B1220',
  surface: '#121B2E',
  surfaceElevated: '#1A2540',
  border: 'rgba(255,255,255,0.08)',
  text: '#F4F6FB',
  textMuted: 'rgba(244,246,251,0.62)',
  accent: '#3EE8C4',
  accentSoft: 'rgba(62,232,196,0.18)',
  coral: '#FF7B6A',
  amber: '#FFC857',
  iris: '#8B7CFF',
  overlay: 'rgba(6,10,18,0.72)',
} as const;

export const CategoryColors = {
  bildiri: KonumColors.coral,
  etkinlik: KonumColors.iris,
  anlik: KonumColors.amber,
} as const;
