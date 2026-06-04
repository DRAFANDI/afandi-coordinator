import type { Filters } from '@/lib/useClients'
import { SOURCES, SERVICES, CONCERNS } from '@/data/constants'
import { STAGES, STATUSES } from '@/data/constants'
import { btn, inp, lbl, sel } from '@/lib/styles'

interface FiltersBarProps {
  filters:      Filters
  onChange:     (filters: Filters) => void
  onReset:      () => void
}

export function FiltersBar({ filters, onChange, onReset }: FiltersBarProps) {
  const update = (key: keyof Filters, value: string | boolean) =>
    onChange({ ...filters, [key]: value })

  return (
    <div style={{
      background:   '#FAFAF7',
      border:       '1px solid #EEE9E2',
      borderRadius: 12,
      padding:      '14px 16px',
      marginBottom: 16,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 2fr', gap: 8 }}>
        {/* Stage */}
        <div>
          <label style={lbl}>المرحلة</label>
          <select style={{ ...sel, width: '100%' }} value={filters.stage} onChange={e => update('stage', e.target.value)}>
            <option value=''>الكل</option>
            {Object.entries(STAGES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={lbl}>الحالة</label>
          <select style={{ ...sel, width: '100%' }} value={filters.status} onChange={e => update('status', e.target.value)}>
            <option value=''>الكل</option>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Source */}
        <div>
          <label style={lbl}>المصدر</label>
          <select style={{ ...sel, width: '100%' }} value={filters.source} onChange={e => update('source', e.target.value)}>
            <option value=''>الكل</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Service */}
        <div>
          <label style={lbl}>الخدمة</label>
          <select style={{ ...sel, width: '100%' }} value={filters.service} onChange={e => update('service', e.target.value)}>
            <option value=''>الكل</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Concern */}
        <div>
          <label style={lbl}>القلق</label>
          <select style={{ ...sel, width: '100%' }} value={filters.concern} onChange={e => update('concern', e.target.value)}>
            <option value=''>الكل</option>
            {CONCERNS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Search */}
        <div>
          <label style={lbl}>بحث</label>
          <input
            style={inp}
            placeholder='اسم أو رقم...'
            value={filters.search}
            onChange={e => update('search', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          style={{
            ...btn(filters.priority ? '#8B6F47' : '#A09080'),
            background: filters.priority ? '#8B6F4710' : 'transparent',
          }}
          onClick={() => update('priority', !filters.priority)}
        >
          ⭐ أولوية عالية فقط
        </button>
        <button style={btn('#A09080')} onClick={onReset}>
          مسح الفلاتر
        </button>
      </div>
    </div>
  )
}
