'use client'
import { useState } from 'react'
import type { Client, Stage, Status, Script } from '@/types'
import { STAGES, STATUSES, CLOSED_REASONS, SOURCES, SERVICES, CONCERNS, QUICK_ACTIONS } from '@/data/constants'
import { calcScore, scoreLabel, followUpStatus, isPriority, missingFields, clientSummary, recommendScript } from '@/lib/helpers'
import { card, btn, inp, sel, lbl } from '@/lib/styles'
import { Badge } from '@/components/ui/Badge'
import { CopyBtn } from '@/components/ui/CopyBtn'
import { Modal } from '@/components/ui/Modal'

interface ClientCardProps {
  client:          Client
  onUpdate:        (id: number, changes: Partial<Client>, timelineText?: string) => void
  onChangeStatus:  (id: number, status: Status, onNeedReason: (id: number) => void) => void
  onChangeStage:   (id: number, stage: Stage) => void
  onDelete:        (id: number) => void
  onQuickAction:   (id: number, text: string) => void
  onAddNote:       (id: number) => void
  noteValue:       string
  onNoteChange:    (id: number, val: string) => void
  onCloseWithReason: (id: number, reason: string) => void
  onShowScript:    (script: Script) => void
}

export function ClientCard({
  client, onUpdate, onChangeStatus, onChangeStage,
  onDelete, onQuickAction, onAddNote, noteValue,
  onNoteChange, onCloseWithReason, onShowScript,
}: ClientCardProps) {
  const [expanded,     setExpanded]     = useState(false)
  const [editing,      setEditing]      = useState(false)
  const [editData,     setEditData]     = useState<Client>(client)
  const [showSummary,  setShowSummary]  = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)

  const score      = calcScore(client)
  const sl         = scoreLabel(score)
  const fuStatus   = followUpStatus(client.nextFollowUpDate)
  const missing    = missingFields(client)
  const priority   = isPriority(client)
  const stageInfo  = STAGES[client.stage]
  const statusInfo = STATUSES[client.status]
  const rec        = recommendScript(client.concern, client.stage, client.status)

  const handleSave = () => {
    onUpdate(client.id, editData, 'تم تعديل بيانات العميل')
    setEditing(false)
  }

  const handleStatusChange = (status: Status) => {
    onChangeStatus(client.id, status, () => setShowCloseModal(true))
  }

  // ── EDIT FORM ──────────────────────────────────────────
  if (editing) return (
    <div style={card(`${stageInfo.color}25`)}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        {([
          ['name', 'الاسم'], ['phone', 'الرقم'], ['priceGiven', 'السعر المُعطى'],
          ['lastContact', 'آخر تواصل'], ['nextAction', 'الخطوة التالية'],
          ['nextFollowUpDate', 'تاريخ المتابعة (YYYY-MM-DD)'],
        ] as [keyof Client, string][]).map(([k, l]) => (
          <div key={k}>
            <label style={lbl}>{l}</label>
            <input
              style={inp}
              value={String(editData[k] || '')}
              onChange={e => setEditData(p => ({ ...p, [k]: e.target.value }))}
            />
          </div>
        ))}

        <div>
          <label style={lbl}>المصدر</label>
          <select style={{ ...sel, width: '100%' }} value={editData.source} onChange={e => setEditData(p => ({ ...p, source: e.target.value }))}>
            {SOURCES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>الخدمة</label>
          <select style={{ ...sel, width: '100%' }} value={editData.service} onChange={e => setEditData(p => ({ ...p, service: e.target.value }))}>
            {SERVICES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>القلق</label>
          <select style={{ ...sel, width: '100%' }} value={editData.concern} onChange={e => setEditData(p => ({ ...p, concern: e.target.value }))}>
            {CONCERNS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>المرحلة النفسية</label>
          <select style={{ ...sel, width: '100%' }} value={editData.stage} onChange={e => setEditData(p => ({ ...p, stage: e.target.value as Stage }))}>
            {Object.entries(STAGES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>الحالة التشغيلية</label>
          <select style={{ ...sel, width: '100%' }} value={editData.status} onChange={e => setEditData(p => ({ ...p, status: e.target.value as Status }))}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>ملاحظات</label>
        <textarea
          style={{ ...inp, minHeight: 70, resize: 'vertical' }}
          value={editData.notes || ''}
          onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btn()} onClick={handleSave}>حفظ</button>
        <button style={btn('#A09080')} onClick={() => setEditing(false)}>إلغاء</button>
      </div>
    </div>
  )

  return (
    <>
      {/* SUMMARY MODAL */}
      {showSummary && (
        <Modal onClose={() => setShowSummary(false)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 14, color: '#8B6F47' }}>ملخص العميل — {client.name}</div>
            <button onClick={() => setShowSummary(false)} style={{ background: 'none', border: 'none', color: '#A09080', cursor: 'pointer' }}>✕</button>
          </div>
          <pre style={{
            margin: 0, background: '#F5F1EA', borderRadius: 10,
            padding: '14px', fontSize: 11, color: '#7A6040',
            lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'inherit', overflowX: 'auto',
          }}>
            {clientSummary(client)}
          </pre>
          <CopyBtn text={clientSummary(client)} label='نسخ الملخص' />
        </Modal>
      )}

      {/* CLOSE REASON MODAL */}
      {showCloseModal && (
        <Modal onClose={() => setShowCloseModal(false)} maxWidth={380}>
          <div style={{ fontSize: 14, color: '#C4A0B5', marginBottom: 16 }}>سبب الإغلاق — مطلوب</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {Object.entries(CLOSED_REASONS).map(([key, r]) => (
              <button
                key={key}
                onClick={() => { onCloseWithReason(client.id, key); setShowCloseModal(false) }}
                style={{ ...btn(r.color), textAlign: 'right', padding: '10px 14px' }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button style={{ ...btn('#A09080'), marginTop: 12, width: '100%' }} onClick={() => setShowCloseModal(false)}>
            إلغاء
          </button>
        </Modal>
      )}

      {/* MAIN CARD */}
      <div style={card(`${stageInfo.color}22`)}>

        {/* ROW 1 — NAME + BADGES */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              {priority && <span style={{ fontSize: 12 }}>⭐</span>}
              <span style={{ fontSize: 14, color: '#2C2420', fontWeight: 500 }}>{client.name}</span>
              {client.phone && <span style={{ fontSize: 10, color: '#A09080' }}>{client.phone}</span>}
              <Badge label={`${stageInfo.icon} ${stageInfo.label}`} color={stageInfo.color} />
              <Badge label={`${statusInfo.icon} ${statusInfo.label}`} color={statusInfo.color} />
              <Badge label={`${sl.icon} ${score}`} color={sl.color} />
              {fuStatus && <Badge label={`${fuStatus.icon} ${fuStatus.label}`} color={fuStatus.color} />}
              {client.status === 'closed' && client.closedReason && (
                <Badge label={CLOSED_REASONS[client.closedReason]?.label} color='#9A8E82' />
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[client.service, client.concern, client.source].filter(Boolean).map((t, i) => (
                <span key={i} style={{ fontSize: 11, color: '#A09080' }}>#{t}</span>
              ))}
            </div>
          </div>

          {/* STATUS QUICK BUTTONS */}
          <div style={{ display: 'flex', gap: 4, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 220 }}>
            {Object.entries(STATUSES).map(([key, st]) => (
              <button
                key={key}
                title={st.label}
                onClick={() => handleStatusChange(key as Status)}
                style={{
                  ...btn(client.status === key ? st.color : '#C0B5AC'),
                  padding: '3px 7px',
                  fontSize: 11,
                  background: client.status === key ? `${st.color}18` : 'transparent',
                }}
              >
                {st.icon}
              </button>
            ))}
          </div>
        </div>

        {/* NEXT ACTION */}
        {(client.nextAction || client.nextFollowUpDate) && (
          <div style={{ background: '#F5F1EA', borderRadius: 8, padding: '7px 12px', marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {client.nextAction && (
              <div>
                <span style={{ fontSize: 10, color: '#A09080' }}>التالي: </span>
                <span style={{ fontSize: 12, color: '#7A6040' }}>{client.nextAction}</span>
              </div>
            )}
            {client.nextFollowUpDate && (
              <div>
                <span style={{ fontSize: 10, color: '#A09080' }}>متابعة: </span>
                <span style={{ fontSize: 12, color: '#8B6F47' }}>{client.nextFollowUpDate}</span>
              </div>
            )}
          </div>
        )}

        {/* WARNINGS */}
        {missing.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {missing.map((m, i) => (
              <span key={i} style={{
                fontSize: 10, color: '#B5808A',
                background: '#B5808A10', border: '1px solid #B5808A30',
                borderRadius: 6, padding: '2px 7px',
              }}>
                ⚠ ناقص: {m}
              </span>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <button style={btn('#A09080')} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'إخفاء ▲' : 'التفاصيل ▼'}
          </button>
          <button style={btn(rec?.color || '#8B6F47')} onClick={() => onShowScript(rec)}>
            {rec?.icon} السكريبت
          </button>
          <button style={btn('#6A8BA8')} onClick={() => { setEditData({ ...client }); setEditing(true) }}>
            تعديل
          </button>
          <button style={btn('#5A8C6A')} onClick={() => setShowSummary(true)}>
            ملخص AI
          </button>
          <button style={btn('#B5808A')} onClick={() => onDelete(client.id)}>
            حذف
          </button>
        </div>

        {/* EXPANDED SECTION */}
        {expanded && (
          <div style={{ marginTop: 14, borderTop: '1px solid #EEE9E2', paddingTop: 14 }}>
            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                ['السعر المُعطى', client.priceGiven || '—'],
                ['آخر تواصل',    client.lastContact || '—'],
                ['تاريخ المتابعة', client.nextFollowUpDate || '—'],
              ].map(([l, v], i) => (
                <div key={i} style={{ background: '#F5F1EA', borderRadius: 8, padding: '9px 12px' }}>
                  <div style={{ fontSize: 10, color: '#A09080', marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, color: '#8B6F47' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            {client.notes && (
              <div style={{ background: '#FAF7F4', borderRadius: 8, padding: '9px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: '#A09080', marginBottom: 3 }}>ملاحظات</div>
                <div style={{ fontSize: 12, color: '#7A6040', lineHeight: 1.8 }}>{client.notes}</div>
              </div>
            )}

            {/* Stage Change */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#A09080', marginBottom: 6 }}>تغيير المرحلة النفسية</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(STAGES).map(([key, st]) => (
                  <button
                    key={key}
                    onClick={() => onChangeStage(client.id, key as Stage)}
                    style={{
                      ...btn(st.color),
                      background: client.stage === key ? `${st.color}15` : 'transparent',
                    }}
                  >
                    {st.icon} {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#A09080', marginBottom: 6 }}>إجراءات سريعة</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {QUICK_ACTIONS.map(a => (
                  <button key={a.id} style={btn('#7A6040')} onClick={() => onQuickAction(client.id, a.text)}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Note */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                style={{ ...inp, flex: 1 }}
                placeholder='أضيفي ملاحظة للتايم لاين...'
                value={noteValue}
                onChange={e => onNoteChange(client.id, e.target.value)}
              />
              <button style={btn()} onClick={() => onAddNote(client.id)}>إضافة 📝</button>
            </div>

            {/* Timeline */}
            {client.timeline.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: '#A09080', marginBottom: 8, letterSpacing: 2 }}>التايم لاين</div>
                {client.timeline.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8A97E', marginTop: 4 }} />
                      {i < client.timeline.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: '#EDE8E2', margin: '3px 0' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 4 }}>
                      <div style={{ fontSize: 11, color: '#5A4A3A' }}>{entry.text}</div>
                      <div style={{ fontSize: 10, color: '#A09080', marginTop: 2 }}>{entry.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
