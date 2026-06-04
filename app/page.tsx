'use client'
import { useState } from 'react'
import type { TabId, Script, Client } from '@/types'
import { useClients } from '@/lib/useClients'
import { SCRIPTS, PRICES_TABLE, UNIFIED_PRICE_TEXT, STAGES, STATUSES } from '@/data/constants'
import { card, btn, inp, lbl, sel, sectionTitle } from '@/lib/styles'
import { Header }     from '@/components/layout/Header'
import { KPIRow }     from '@/components/clients/KPIRow'
import { FiltersBar } from '@/components/clients/FiltersBar'
import { ClientCard } from '@/components/clients/ClientCard'
import { ScriptModal } from '@/components/scripts/ScriptModal'
import { CopyBtn }    from '@/components/ui/CopyBtn'

export default function Home() {
  const [tab, setTab]               = useState<TabId>('clients')
  const [activeScript, setActiveScript] = useState<Script | null>(null)
  const [scriptModal, setScriptModal]   = useState<Script | null>(null)
  const [showAdd, setShowAdd]           = useState(false)

  const {
    filteredClients, filters, setFilters, resetFilters,
    kpis, noteInput, setNoteInput,
    loading, error,
    updateClient, changeStatus, changeStage,
    addClient, deleteClient, closeWithReason,
    addQuickAction, addManualNote, emptyClient,
  } = useClients()

  const [newClient, setNewClient] = useState({ ...emptyClient })

  const handleAddClient = async () => {
    if (!newClient.name.trim()) return
    await addClient(newClient)
    setNewClient({ ...emptyClient })
    setShowAdd(false)
  }

  // ── STYLES ───────────────────────────────────────────────
  const pg = {
    maxWidth: 1100,
    margin:   '0 auto',
    padding:  '22px 26px',
  }

  // ── LOADING STATE ────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      <Header activeTab={tab} onTabChange={setTab} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100vh - 64px)', flexDirection:'column', gap:16 }}>
        <div style={{ fontSize:28 }}>🦷</div>
        <div style={{ fontSize:14, color:'#A09080' }}>جاري تحميل البيانات...</div>
      </div>
    </div>
  )

  // ── ERROR STATE ───────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      <Header activeTab={tab} onTabChange={setTab} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100vh - 64px)', flexDirection:'column', gap:12 }}>
        <div style={{ fontSize:28 }}>⚠️</div>
        <div style={{ fontSize:14, color:'#B5808A' }}>خطأ في الاتصال بقاعدة البيانات</div>
        <div style={{ fontSize:12, color:'#A09080', maxWidth:400, textAlign:'center' }}>{error}</div>
        <button onClick={() => window.location.reload()} style={{ marginTop:8, padding:'8px 20px', background:'#8B6F47', color:'#FFF', border:'none', borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
          إعادة المحاولة
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      <Header activeTab={tab} onTabChange={(t) => { setTab(t); setActiveScript(null) }} />

      {/* SCRIPT MODAL */}
      {scriptModal && <ScriptModal script={scriptModal} onClose={() => setScriptModal(null)} />}

      <div style={pg}>

        {/* ════════════════════════════════════════════════
            TAB: CLIENTS
        ════════════════════════════════════════════════ */}
        {tab === 'clients' && (
          <div>
            <KPIRow kpis={kpis} />

            <FiltersBar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />

            {/* Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#A09080' }}>{filteredClients.length} عميل</span>
              <button style={btn()} onClick={() => setShowAdd(!showAdd)}>+ عميل جديد</button>
            </div>

            {/* Add Form */}
            {showAdd && (
              <div style={{ ...card('#C8A97E18'), marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#7A6040', marginBottom: 12 }}>عميل جديد</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 9 }}>
                  {([
                    ['name', 'الاسم'], ['phone', 'الرقم'], ['priceGiven', 'السعر المُعطى'],
                    ['lastContact', 'آخر تواصل'], ['nextAction', 'الخطوة التالية'],
                    ['nextFollowUpDate', 'تاريخ المتابعة (YYYY-MM-DD)'],
                  ] as [keyof typeof newClient, string][]).map(([k, l]) => (
                    <div key={k}>
                      <label style={lbl}>{l}</label>
                      <input
                        style={inp}
                        value={String(newClient[k] || '')}
                        onChange={e => setNewClient(p => ({ ...p, [k]: e.target.value }))}
                      />
                    </div>
                  ))}

                  {([
                    ['source', 'المصدر', Object.fromEntries(require('@/data/constants').SOURCES.map((s: string) => [s, s]))],
                    ['service', 'الخدمة', Object.fromEntries(require('@/data/constants').SERVICES.map((s: string) => [s, s]))],
                    ['concern', 'القلق',  Object.fromEntries(require('@/data/constants').CONCERNS.map((s: string) => [s, s]))],
                  ] as any[]).map(([k, l, opts]) => (
                    <div key={k}>
                      <label style={lbl}>{l}</label>
                      <select style={{ ...sel, width: '100%' }} value={String(newClient[k as keyof typeof newClient] || '')} onChange={e => setNewClient(p => ({ ...p, [k]: e.target.value }))}>
                        {Object.keys(opts).map((o: string) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}

                  <div>
                    <label style={lbl}>المرحلة</label>
                    <select style={{ ...sel, width: '100%' }} value={newClient.stage} onChange={e => setNewClient(p => ({ ...p, stage: e.target.value as any }))}>
                      {Object.entries(STAGES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>الحالة</label>
                    <select style={{ ...sel, width: '100%' }} value={newClient.status} onChange={e => setNewClient(p => ({ ...p, status: e.target.value as any }))}>
                      {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 9 }}>
                  <label style={lbl}>ملاحظات</label>
                  <textarea
                    style={{ ...inp, minHeight: 60, resize: 'vertical' }}
                    value={newClient.notes}
                    onChange={e => setNewClient(p => ({ ...p, notes: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btn()} onClick={handleAddClient}>حفظ</button>
                  <button style={btn('#A09080')} onClick={() => setShowAdd(false)}>إلغاء</button>
                </div>
              </div>
            )}

            {/* Client List */}
            {filteredClients.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px', color: '#A09080', fontSize: 14 }}>لا يوجد عملاء بهذه الفلاتر</div>
              : filteredClients.map(c => (
                  <ClientCard
                    key={c.id}
                    client={c}
                    onUpdate={updateClient}
                    onChangeStatus={changeStatus}
                    onChangeStage={changeStage}
                    onDelete={deleteClient}
                    onQuickAction={addQuickAction}
                    onAddNote={addManualNote}
                    noteValue={noteInput[c.id] || ''}
                    onNoteChange={(id, val) => setNoteInput(p => ({ ...p, [id]: val }))}
                    onCloseWithReason={closeWithReason}
                    onShowScript={setScriptModal}
                  />
                ))
            }
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: SCRIPTS
        ════════════════════════════════════════════════ */}
        {tab === 'scripts' && !activeScript && (
          <div>
            <div style={sectionTitle}>مكتبة السكريبت</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {SCRIPTS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScript(sc)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px', background: '#FFFFFF',
                    border: '1px solid #E8E3DC', borderRadius: 12,
                    cursor: 'pointer', textAlign: 'right', width: '100%',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: `${sc.color}14`, border: `1px solid ${sc.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {sc.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#2C2420', marginBottom: 2 }}>{sc.title}</div>
                    <div style={{ fontSize: 11, color: '#A09080' }}>{sc.trigger}</div>
                  </div>
                  <span style={{ fontSize: 9, color: sc.color, padding: '2px 8px', border: `1px solid ${sc.color}30`, borderRadius: 20 }}>
                    {sc.category}
                  </span>
                  <span style={{ color: '#C0B5AC' }}>←</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'scripts' && activeScript && (
          <div>
            <button onClick={() => setActiveScript(null)} style={{ ...btn('#A09080'), marginBottom: 16 }}>→ رجوع</button>
            <div style={card(`${activeScript.color}25`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>{activeScript.icon}</span>
                <div>
                  <div style={{ fontSize: 15, color: '#2C2420' }}>{activeScript.title}</div>
                  <div style={{ fontSize: 10, color: '#A09080' }}>{activeScript.category}</div>
                </div>
              </div>
              {[['متى', activeScript.trigger], ['ماذا تفكر', activeScript.psychology], ['هدفك', activeScript.goal]].map(([l, v], i) => (
                <div key={i} style={{ background: '#F5F1EA', borderRadius: 8, padding: '8px 12px', marginBottom: 7 }}>
                  <div style={{ fontSize: 10, color: '#A09080', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, color: '#7A6040' }}>{v}</div>
                </div>
              ))}
            </div>
            {[activeScript.reply, activeScript.reply2].filter(Boolean).map((rep, i) => (
              <div key={i} style={card()}>
                <div style={{ fontSize: 10, color: '#A09080', marginBottom: 7 }}>الرد {i === 0 ? 'الأول' : 'الثاني'}</div>
                <pre style={{ margin: 0, fontSize: 12, color: '#5A4A3A', lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: 6 }}>{rep}</pre>
                <CopyBtn text={rep!} />
              </div>
            ))}
            <div style={{ background: `${activeScript.color}10`, border: `1px solid ${activeScript.color}20`, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#A09080', marginBottom: 3 }}>الخطوة التالية</div>
              <div style={{ fontSize: 12, color: activeScript.color }}>{activeScript.nextStep}</div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: MINDSET
        ════════════════════════════════════════════════ */}
        {tab === 'mindset' && (
          <div>
            <div style={sectionTitle}>عقلية المنسقة</div>
            <div style={{ ...card('#C8A97E22'), marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: '#8B6F47', marginBottom: 4 }}>أنتِ مستشارة ابتسامة — لستِ موظفة استقبال</div>
              <div style={{ fontSize: 13, color: '#7A6040', lineHeight: 1.9 }}>
                كل محادثة واتساب هدفها الوحيد: <strong style={{ color: '#8B6F47' }}>حجز موعد كشف</strong>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { icon: '🎯', title: 'هدف كل محادثة',               body: 'حجز موعد كشف — ليس شرح الأسعار فقط' },
                { icon: '🧠', title: 'قبل السعر — افهم الحالة',      body: 'كل عميل عنده دافع خفي ومخاوف حقيقية\nالسعر ليس دائماً المشكلة الحقيقية' },
                { icon: '❓', title: 'كل سؤال يخفي خوفاً أو رغبة', body: '"بدون برد؟" → خوف من فقدان الأسنان\n"مظهر طبيعي؟" → خوف من الندم\n"بكم؟" → قلق مالي أو مقارنة' },
                { icon: '🚪', title: 'كل محادثة تنتهي بخطوة',       body: 'لا تتركي محادثة بدون: سؤال، موعد، أو متابعة محددة' },
                { icon: '🌿', title: 'تبيعين الثقة لا القشور',       body: 'العميلة تشتري ثقتها بك وبالدكتور — قبل أي خدمة' },
                { icon: '⏱️', title: '٣٠ دقيقة أو تبرد الفرصة',     body: 'الرد المتأخر يخسر العميل حتى لو كانت مهتمة جداً' },
              ].map((p, i) => (
                <div key={i} style={card()}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: '#8B6F47', marginBottom: 5 }}>{p.title}</div>
                      <pre style={{ margin: 0, fontSize: 12, color: '#7A6040', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{p.body}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: PRICES
        ════════════════════════════════════════════════ */}
        {tab === 'prices' && (
          <div>
            <div style={sectionTitle}>الأسعار الرسمية</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              {Object.entries(PRICES_TABLE).map(([name, p], i) => (
                <div key={i} style={card(p.current ? '#C8A97E18' : '#E8E3DC')}>
                  <div style={{ fontSize: 11, color: '#A09080', marginBottom: 7 }}>{name}</div>
                  {p.current ? (
                    <div>
                      <span style={{ fontSize: 22, color: '#8B6F47', fontWeight: 600 }}>{p.current.toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: '#A09080' }}> ريال</span>
                      {p.original && p.original !== p.current && (
                        <div style={{ fontSize: 10, color: '#C0B5AC', textDecoration: 'line-through', marginTop: 2 }}>
                          قبل: {p.original.toLocaleString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: '#A09080' }}>بعد الكشف</div>
                  )}
                </div>
              ))}
            </div>
            <div style={card()}>
              <div style={{ fontSize: 11, color: '#7A6040', marginBottom: 10 }}>جملة السعر الموحدة</div>
              <pre style={{
                margin: 0, background: '#F5F1EA', borderRadius: 10,
                padding: '12px 14px', fontSize: 12, color: '#7A6040',
                lineHeight: 1.9, whiteSpace: 'pre-wrap', fontFamily: 'inherit',
              }}>
                {UNIFIED_PRICE_TEXT}
              </pre>
              <div style={{ marginTop: 9 }}>
                <CopyBtn text={UNIFIED_PRICE_TEXT} label='نسخ الجملة' />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: AI ROADMAP
        ════════════════════════════════════════════════ */}
        {tab === 'ai' && (
          <div>
            <div style={sectionTitle}>خارطة طريق V5</div>
            <div style={{ ...card('#C8A97E18'), textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🚧</div>
              <div style={{ fontSize: 15, color: '#8B6F47', marginBottom: 6 }}>المساعد الذكي — قادم في V5</div>
              <div style={{ fontSize: 12, color: '#A09080', lineHeight: 1.9 }}>
                النظام جاهز استعداداً للـ AI — زر "ملخص AI" في كل عميل يولّد السياق تلقائياً
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { n: '1', icon: '🔍', title: 'كشف المرحلة النفسية',  desc: 'تحليل النص وتحديد: فضول / اهتمام / قرار / تردد' },
                { n: '2', icon: '💭', title: 'كشف القلق الخفي',      desc: 'كشف: السعر / الألم / الندم / المسافة / الثقة' },
                { n: '3', icon: '✍️', title: 'اقتراح ردّين فقط',    desc: 'خيارين لا أكثر — بناءً على المرحلة والقلق' },
                { n: '4', icon: '📅', title: 'اقتراح المتابعة',      desc: 'أفضل وقت وطريقة ورسالة للمتابعة' },
                { n: '5', icon: '📊', title: 'تحليل الفرص الضائعة',  desc: 'لماذا انتهت المحادثة؟ ماذا كان يجب أن يحدث؟' },
                { n: '6', icon: '🎓', title: 'كوتشينج المنسقة',      desc: 'تقييم أداء المحادثة واقتراحات التحسين' },
              ].map((f, i) => (
                <div key={i} style={card()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F2EEE8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#5A4A3A', marginBottom: 2 }}>{f.n}. {f.title}</div>
                      <div style={{ fontSize: 11, color: '#A09080' }}>{f.desc}</div>
                    </div>
                    <span style={{ fontSize: 9, color: '#A09080', padding: '2px 8px', border: '1px solid #DDD8D0', borderRadius: 20 }}>🚧 V5</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...card('#B5808A18'), marginTop: 14 }}>
              <div style={{ fontSize: 11, color: '#B5808A', marginBottom: 10 }}>⚠️ المساعد لن يقوم بـ</div>
              {['تغيير أسعار العيادة', 'اختراع خطط علاجية', 'تشخيص الحالات', 'ضمان النتائج', 'استبدال قرار المنسقة'].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 12, color: '#7A6040' }}>
                  <span style={{ color: '#B5808A' }}>✕</span><span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
