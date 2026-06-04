interface BadgeProps {
  label: string
  color: string
  small?: boolean
}

export function Badge({ label, color, small }: BadgeProps) {
  return (
    <span style={{
      fontSize:    small ? 9 : 10,
      color,
      padding:     '2px 8px',
      border:      `1px solid ${color}40`,
      borderRadius: 20,
      whiteSpace:  'nowrap',
    }}>
      {label}
    </span>
  )
}
