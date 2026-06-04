'use client'
import { useState } from 'react'

interface CopyBtnProps {
  text: string
  label?: string
}

export function CopyBtn({ text, label = 'نسخ' }: CopyBtnProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        background: 'none',
        border:     'none',
        cursor:     'pointer',
        color:      copied ? '#8B6F47' : '#A09080',
        fontSize:   11,
        padding:    '4px 8px',
        fontFamily: 'inherit',
      }}
    >
      {copied ? '✓ تم' : label}
    </button>
  )
}
