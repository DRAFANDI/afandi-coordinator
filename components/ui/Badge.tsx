import { T } from '@/lib/styles'

interface BadgeProps {
  label: string
  color: string
  small?: boolean
}

export function Badge({ label, color, small }: BadgeProps) {
  return (
    <span style={{
      fontSize:      small ? 9 : 10,
      fontWeight:    500,
      color,
      padding:       small ? '1px 6px' : '2px 8px',
      border:        `1px solid ${color}35`,
      borderRadius:  20,
      whiteSpace:    'nowrap',
      background:    `${color}10`,
      display:       'inline-flex',
      alignItems:    'center',
      lineHeight:    1.5,
      letterSpacing: '.1px',
    }}>
      {label}
    </span>
  )
}
