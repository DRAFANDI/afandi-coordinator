import type { CSSProperties } from 'react'

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════

export const T = {
  bg:        '#F5F2ED',
  surface:   '#FFFFFF',
  surfaceAlt:'#FAFAF8',
  border:    '#E8E3DC',
  borderSoft:'#EEE9E2',
  text:      '#2C2420',
  textMid:   '#7A6040',
  textSoft:  '#9A8E82',
  textMuted: '#A09080',
  accent:    '#8B6F47',
  accentSoft:'#C8A97E',
}

// ═══════════════════════════════════════════════════════════
// SHARED STYLE BUILDERS
// ═══════════════════════════════════════════════════════════

export const card = (borderColor?: string): CSSProperties => ({
  background:   T.surface,
  border:       `1px solid ${borderColor || T.border}`,
  borderRadius: 14,
  padding:      '16px 20px',
  marginBottom: 10,
})

export const btn = (color = T.accent): CSSProperties => ({
  background:   `${color}10`,
  border:       `1px solid ${color}35`,
  color,
  padding:      '6px 12px',
  borderRadius: 8,
  cursor:       'pointer',
  fontSize:     12,
  whiteSpace:   'nowrap',
  fontFamily:   'inherit',
})

export const inp: CSSProperties = {
  background:  T.surfaceAlt,
  border:      `1px solid ${T.border}`,
  borderRadius: 8,
  padding:     '8px 12px',
  color:       T.text,
  fontSize:    12,
  width:       '100%',
  outline:     'none',
  fontFamily:  'inherit',
  direction:   'rtl',
  boxSizing:   'border-box',
}

export const sel: CSSProperties = {
  ...inp,
  width:  'auto',
  cursor: 'pointer',
}

export const lbl: CSSProperties = {
  fontSize:    10,
  color:       T.textMuted,
  marginBottom: 4,
  display:     'block',
}

export const sectionTitle: CSSProperties = {
  fontSize:      10,
  letterSpacing: 3,
  color:         T.textMuted,
  textTransform: 'uppercase',
  marginBottom:  14,
}
