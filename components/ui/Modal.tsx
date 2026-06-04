'use client'
import { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
  maxWidth?: number
}

export function Modal({ children, onClose, maxWidth = 540 }: ModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     '#00000055',
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
          background:   '#FFFFFF',
          border:       '1px solid #DDD8D0',
          borderRadius: 16,
          padding:      '24px 28px',
          maxWidth,
          width:        '100%',
          maxHeight:    '88vh',
          overflowY:    'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}
