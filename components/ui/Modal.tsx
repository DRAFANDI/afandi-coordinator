'use client'
import { ReactNode, useEffect } from 'react'
import { T, shadows } from '@/lib/styles'

interface ModalProps {
  children: ReactNode
  onClose:  () => void
  maxWidth?: number
}

export function Modal({ children, onClose, maxWidth = 540 }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(26, 20, 16, 0.45)',
        backdropFilter: 'blur(2px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         999,
        padding:        16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:   T.surface,
          border:       `1px solid ${T.border}`,
          borderRadius: 16,
          padding:      '24px 28px',
          maxWidth,
          width:        '100%',
          maxHeight:    '88vh',
          overflowY:    'auto',
          boxShadow:    shadows.lg,
        }}
      >
        {children}
      </div>
    </div>
  )
}
