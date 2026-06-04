import type { KPIData } from '@/types'

interface KPIRowProps {
  kpis: KPIData
}

export function KPIRow({ kpis }: KPIRowProps) {
  const row1 = [
    { label: 'جديد',        count: kpis.new,       color: '#8BB8D4' },
    { label: 'مهتم',        count: kpis.interested, color: '#A8C5A0' },
    { label: 'متابعة',      count: kpis.follow_up,  color: '#D4C4A0' },
    { label: 'محجوز',       count: kpis.booked,     color: '#C8A97E' },
    { label: 'زار العيادة', count: kpis.visited,    color: '#B5C4D4' },
    { label: 'بدأ العلاج',  count: kpis.treatment,  color: '#A8C5A0' },
    { label: 'مغلق',        count: kpis.closed,     color: '#9A8E82' },
  ]

  const row2 = [
    { label: 'متابعات متأخرة', count: kpis.followDue,  color: '#C4A0B5', icon: '🔴' },
    { label: 'بيانات ناقصة',   count: kpis.incomplete, color: '#D4C4A0', icon: '⚠'  },
    { label: 'متوسط النقاط',   count: kpis.avgScore,   color: '#8B6F47', icon: '📊' },
    { label: 'مغلق بالسعر',    count: kpis.lostPrice,  color: '#C4A0B5', icon: '💰' },
    { label: 'مغلق لا رد',     count: kpis.lostNoRep,  color: '#8B9DC3', icon: '🔇' },
    { label: 'مغلق لمنافس',    count: kpis.lostComp,   color: '#C49A8B', icon: '🏃' },
  ]

  const kpiCard = (
    item: { label: string; count: number; color: string; icon?: string },
    subtle = false
  ) => (
    <div
      key={item.label}
      style={{
        background:   subtle ? '#FAFAF7' : '#FFFFFF',
        border:       `1px solid ${item.color}22`,
        borderRadius: 10,
        padding:      '10px 14px',
        flex:         1,
        minWidth:     80,
        textAlign:    'center',
      }}
    >
      {item.icon && <div style={{ fontSize: 10, marginBottom: 2 }}>{item.icon}</div>}
      <div style={{ fontSize: subtle ? 18 : 20, color: item.color, fontWeight: 600 }}>{item.count}</div>
      <div style={{ fontSize: 9, color: '#A09080', marginTop: 3 }}>{item.label}</div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 10, flexWrap: 'wrap' }}>
        {row1.map(k => kpiCard(k))}
      </div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 20, flexWrap: 'wrap' }}>
        {row2.map(k => kpiCard(k, true))}
      </div>
    </div>
  )
}
