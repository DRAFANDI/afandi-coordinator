import type { TabId } from '@/types'

interface HeaderProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'clients',  label: 'العملاء',       icon: '👥' },
  { id: 'scripts',  label: 'السكريبت',      icon: '📋' },
  { id: 'mindset',  label: 'عقلية المنسقة', icon: '🧠' },
  { id: 'prices',   label: 'الأسعار',       icon: '💎' },
  { id: 'ai',       label: 'V5 قادم',       icon: '✨' },
]

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header style={{
      background:    '#FFFFFF',
      borderBottom:  '1px solid #E8E3DC',
      padding:       '14px 26px',
      display:       'flex',
      alignItems:    'center',
      justifyContent:'space-between',
      position:      'sticky',
      top:           0,
      zIndex:        100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width:          36,
          height:         36,
          borderRadius:   '50%',
          background:     'linear-gradient(135deg,#C8A97E,#A07848)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       16,
        }}>
          🦷
        </div>
        <div>
          <div style={{ fontSize: 14, color: '#8B6F47' }}>عيادة د. محمد أفندي</div>
          <div style={{ fontSize: 9, color: '#A09080', letterSpacing: 2 }}>COORDINATOR OS V4</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 3 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              padding:    '6px 13px',
              borderRadius: 8,
              border:     'none',
              cursor:     'pointer',
              fontSize:   12,
              background: activeTab === t.id ? '#F0EAE0' : 'transparent',
              color:      activeTab === t.id ? '#8B6F47' : '#A09080',
              fontFamily: 'inherit',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
