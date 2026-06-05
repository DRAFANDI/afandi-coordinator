import type { CSSProperties } from 'react'

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS
// Single source of truth — all colors and values from here
// ═══════════════════════════════════════════════════════════

export const T = {
  // Backgrounds
  bg:         '#F8F6F2',
  surface:    '#FFFFFF',
  surfaceAlt: '#FAFAF8',

  // Borders
  border:     '#EAE6DF',
  border2:    '#DDD8CF',

  // Text
  text:       '#1A1410',
  text2:      '#5C5147',
  text3:      '#9E9389',
  text4:      '#C4BCB4',

  // Brand
  accent:     '#8B6F47',
  accentL:    '#C8A97E',
  accentBg:   '#F5EDE0',
  accentBdr:  '#E2CDB0',

  // Success
  green:      '#4A8C6A',
  greenBg:    '#EBF4EE',
  greenBdr:   '#C0DFD0',

  // Info
  blue:       '#4A72A8',
  blueBg:     '#EBF1F9',
  blueBdr:    '#C0D4F0',

  // Error
  red:        '#A85A5A',
  redBg:      '#F9EBEB',
  redBdr:     '#F0CACA',

  // Warning
  yellow:     '#A87E4A',
  yellowBg:   '#F9F0E5',
  yellowBdr:  '#E8D0B0',
} as const

// ═══════════════════════════════════════════════════════════
// SHADOW TOKENS
// ═══════════════════════════════════════════════════════════

export const shadows = {
  xs: '0 1px 2px rgba(0,0,0,.04)',
  sm: '0 1px 4px rgba(0,0,0,.05), 0 2px 8px rgba(0,0,0,.04)',
  md: '0 2px 8px rgba(0,0,0,.06), 0 4px 20px rgba(0,0,0,.04)',
  lg: '0 4px 16px rgba(0,0,0,.08), 0 8px 32px rgba(0,0,0,.05)',
} as const

// ═══════════════════════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════════════════════

export const card = (borderColor?: string): CSSProperties => ({
  background:   T.surface,
  border:       `1px solid ${borderColor || T.border}`,
  borderRadius: 12,
  padding:      '16px 20px',
  marginBottom: 10,
  boxShadow:    shadows.sm,
})

// ═══════════════════════════════════════════════════════════
// BUTTONS
// ═══════════════════════════════════════════════════════════

export const btn = (color: string = T.accent): CSSProperties => ({
  background:   `${color}10`,
  border:       `1px solid ${color}30`,
  color,
  padding:      '7px 14px',
  borderRadius: 8,
  cursor:       'pointer',
  fontSize:     12,
  fontWeight:   500,
  whiteSpace:   'nowrap',
  fontFamily:   'inherit',
  display:      'inline-flex',
  alignItems:   'center',
  gap:          5,
  lineHeight:   1.4,
})

export const btnPrimary: CSSProperties = {
  background:   T.accent,
  color:        '#FFFFFF',
  border:       'none',
  padding:      '8px 16px',
  borderRadius: 8,
  cursor:       'pointer',
  fontSize:     12,
  fontWeight:   500,
  fontFamily:   'inherit',
  display:      'inline-flex',
  alignItems:   'center',
  gap:          6,
  whiteSpace:   'nowrap',
  lineHeight:   1.4,
  boxShadow:    '0 1px 3px rgba(139,111,71,.25)',
}

// ═══════════════════════════════════════════════════════════
// FORM ELEMENTS
// ═══════════════════════════════════════════════════════════

export const inp: CSSProperties = {
  background:   T.surface,
  border:       `1px solid ${T.border2}`,
  borderRadius: 8,
  padding:      '9px 12px',
  color:        T.text,
  fontSize:     13,
  width:        '100%',
  outline:      'none',
  fontFamily:   'inherit',
  direction:    'rtl',
  boxSizing:    'border-box',
  lineHeight:   1.4,
  transition:   'border-color .12s ease, box-shadow .12s ease',
}

export const sel: CSSProperties = {
  ...inp,
  width:  'auto',
  cursor: 'pointer',
}

export const lbl: CSSProperties = {
  fontSize:      11,
  fontWeight:    600,
  color:         T.text3,
  marginBottom:  5,
  display:       'block',
  letterSpacing: '.3px',
  lineHeight:    1.3,
}

// ═══════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════

export const sectionTitle: CSSProperties = {
  fontSize:      10,
  letterSpacing: 2.5,
  color:         T.text3,
  textTransform: 'uppercase',
  marginBottom:  16,
  fontWeight:    600,
  lineHeight:    1.2,
}

// ═══════════════════════════════════════════════════════════
// TAG / BADGE
// ═══════════════════════════════════════════════════════════

type TagVariant = 'gold' | 'green' | 'blue' | 'red' | 'yellow' | 'gray'

export const tagStyle = (variant: TagVariant): CSSProperties => {
  const map: Record<TagVariant, { bg: string; color: string; border: string }> = {
    gold:   { bg: T.accentBg,  color: T.accent, border: T.accentBdr  },
    green:  { bg: T.greenBg,   color: T.green,  border: T.greenBdr   },
    blue:   { bg: T.blueBg,    color: T.blue,   border: T.blueBdr    },
    red:    { bg: T.redBg,     color: T.red,    border: T.redBdr     },
    yellow: { bg: T.yellowBg,  color: T.yellow, border: T.yellowBdr  },
    gray:   { bg: '#F2EEE8',   color: T.text3,  border: T.border     },
  }
  const v = map[variant]
  return {
    fontSize:      10,
    fontWeight:    500,
    padding:       '2px 8px',
    borderRadius:  20,
    background:    v.bg,
    color:         v.color,
    border:        `1px solid ${v.border}`,
    whiteSpace:    'nowrap',
    display:       'inline-flex',
    alignItems:    'center',
    lineHeight:    1.5,
  }
}
