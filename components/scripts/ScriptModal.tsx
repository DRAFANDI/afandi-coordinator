import type { Script } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { CopyBtn } from '@/components/ui/CopyBtn'

interface ScriptModalProps {
  script:  Script
  onClose: () => void
}

export function ScriptModal({ script, onClose }: ScriptModalProps) {
  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>{script.icon}</span>
          <div>
            <div style={{ fontSize: 15, color: '#2C2420' }}>{script.title}</div>
            <div style={{ fontSize: 10, color: '#A09080' }}>{script.category}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A09080', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>

      {/* Info rows */}
      {[
        ['متى تستخدمينه', script.trigger],
        ['ماذا تفكر العميلة', script.psychology],
        ['هدفك', script.goal],
      ].map(([l, v], i) => (
        <div key={i} style={{ background: '#F5F1EA', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: '#A09080', marginBottom: 3 }}>{l}</div>
          <div style={{ fontSize: 12, color: '#7A6040' }}>{v}</div>
        </div>
      ))}

      {/* Replies */}
      {[script.reply, script.reply2].filter(Boolean).map((rep, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: '#A09080', marginBottom: 5 }}>
            الرد {i === 0 ? 'الأول' : 'الثاني'}
          </div>
          <div style={{ background: '#FAFAF8', border: '1px solid #EDE8E2', borderRadius: 10, overflow: 'hidden' }}>
            <pre style={{
              margin: 0, padding: '12px 14px', fontSize: 12, color: '#5A4A3A',
              lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'inherit',
            }}>
              {rep}
            </pre>
            <div style={{ borderTop: '1px solid #EEE9E2', padding: '3px 8px' }}>
              <CopyBtn text={rep!} />
            </div>
          </div>
        </div>
      ))}

      {/* Next step */}
      <div style={{
        background: `${script.color}10`,
        border:     `1px solid ${script.color}20`,
        borderRadius: 8,
        padding:    '10px 12px',
      }}>
        <div style={{ fontSize: 10, color: '#A09080', marginBottom: 3 }}>الخطوة التالية</div>
        <div style={{ fontSize: 12, color: script.color }}>{script.nextStep}</div>
      </div>
    </Modal>
  )
}
