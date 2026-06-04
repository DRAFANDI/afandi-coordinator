import type { Client, ScoreLabel, FollowUpStatus, TimelineEntry } from '@/types'
import { STAGES, STATUSES } from '@/data/constants'

// ═══════════════════════════════════════════════════════════
// DATE HELPERS
// ═══════════════════════════════════════════════════════════

export const todayISO = (): string => new Date().toISOString().split('T')[0]

export const makeEntry = (type: string, text: string): TimelineEntry => ({
  date: todayISO(),
  type,
  text,
})

// ═══════════════════════════════════════════════════════════
// SCORE
// ═══════════════════════════════════════════════════════════

export function calcScore(c: Client): number {
  let s = 0
  s += STAGES[c.stage]?.score  || 0
  s += STATUSES[c.status]?.score || 0
  if (c.concern === 'السعر')            s -= 5
  if (c.concern === 'من خارج الرياض') s -= 10
  if (c.phone)                          s += 5
  if (c.nextFollowUpDate)               s += 5
  return Math.min(100, Math.max(0, s))
}

export function scoreLabel(n: number): ScoreLabel {
  if (n >= 90) return { icon: '🔥', color: '#8B6F47', label: 'ممتاز'  }
  if (n >= 70) return { icon: '🟡', color: '#8B7848', label: 'جيد'    }
  if (n >= 40) return { icon: '🔵', color: '#6A8BA8', label: 'متوسط'  }
  return              { icon: '⚫', color: '#9A8E82', label: 'منخفض'  }
}

// ═══════════════════════════════════════════════════════════
// FOLLOW-UP STATUS
// ═══════════════════════════════════════════════════════════

export function followUpStatus(dateStr: string | null | undefined): FollowUpStatus | null {
  if (!dateStr) return null
  const d    = new Date(dateStr)
  const t    = new Date(todayISO())
  const diff = Math.floor((d.getTime() - t.getTime()) / 86400000)
  if (diff < 0)   return { icon: '🔴', label: 'متأخرة', color: '#C4A0B5' }
  if (diff === 0) return { icon: '🟠', label: 'اليوم',  color: '#D4C4A0' }
  if (diff === 1) return { icon: '🟢', label: 'غداً',   color: '#A8C5A0' }
  return null
}

// ═══════════════════════════════════════════════════════════
// PRIORITY & VALIDATION
// ═══════════════════════════════════════════════════════════

export function isPriority(c: Client): boolean {
  return calcScore(c) > 75 || c.stage === 'ready' || c.status === 'booked'
}

export function missingFields(c: Client): string[] {
  const missing: string[] = []
  if (!c.phone)                             missing.push('الرقم')
  if (!c.concern || c.concern === 'أخرى') missing.push('القلق')
  if (!c.nextFollowUpDate)                  missing.push('تاريخ المتابعة')
  return missing
}

// ═══════════════════════════════════════════════════════════
// AI SUMMARY
// ═══════════════════════════════════════════════════════════

export function clientSummary(c: Client): string {
  const tl = (c.timeline || []).map(t => `[${t.date}] ${t.text}`).join('\n')
  return `العميل: ${c.name}
الخدمة: ${c.service}
القلق: ${c.concern}
المرحلة النفسية: ${STAGES[c.stage]?.label}
الحالة التشغيلية: ${STATUSES[c.status]?.label}
المصدر: ${c.source}
السعر المُعطى: ${c.priceGiven || 'لم يُعطَ'}
المتابعة القادمة: ${c.nextFollowUpDate || 'غير محدد'}
الخطوة التالية: ${c.nextAction || 'غير محدد'}
ملاحظات: ${c.notes || 'لا توجد'}

التايم لاين:
${tl || 'لا يوجد'}`
}

// ═══════════════════════════════════════════════════════════
// SCRIPT RECOMMENDATION
// ═══════════════════════════════════════════════════════════

import type { Script } from '@/types'
import { SCRIPTS } from '@/data/constants'

export function recommendScript(
  concern: string,
  stage: string,
  status: string
): Script {
  if (status === 'follow_up' || status === 'visited')                       return SCRIPTS.find(s => s.id === 'followup')!
  if (status === 'booked')                                                   return SCRIPTS.find(s => s.id === 'booking')!
  if (concern === 'السعر')                                                   return SCRIPTS.find(s => s.id === 'price')!
  if (concern === 'مظهر طبيعي')                                            return SCRIPTS.find(s => s.id === 'natural')!
  if (concern === 'بدون برد')                                               return SCRIPTS.find(s => s.id === 'nogrind')!
  if (concern === 'الخوف من الألم' || concern === 'الخوف من الندم')        return SCRIPTS.find(s => s.id === 'fear')!
  if (concern === 'من خارج الرياض')                                        return SCRIPTS.find(s => s.id === 'outside')!
  if (stage === 'hesitant')                                                  return SCRIPTS.find(s => s.id === 'fear')!
  if (stage === 'ready')                                                     return SCRIPTS.find(s => s.id === 'booking')!
  return SCRIPTS.find(s => s.id === 'price')!
}

// ═══════════════════════════════════════════════════════════
// KPI CALCULATOR
// ═══════════════════════════════════════════════════════════

import type { KPIData } from '@/types'

export function calcKPIs(clients: Client[]): KPIData {
  return {
    new:        clients.filter(c => c.status === 'new').length,
    interested: clients.filter(c => c.status === 'interested').length,
    follow_up:  clients.filter(c => c.status === 'follow_up').length,
    booked:     clients.filter(c => c.status === 'booked').length,
    visited:    clients.filter(c => c.status === 'visited').length,
    treatment:  clients.filter(c => c.status === 'started_treatment').length,
    closed:     clients.filter(c => c.status === 'closed').length,
    followDue:  clients.filter(c => {
      const f = followUpStatus(c.nextFollowUpDate)
      return f && (f.label === 'متأخرة' || f.label === 'اليوم')
    }).length,
    incomplete: clients.filter(c => missingFields(c).length > 0).length,
    avgScore:   clients.length
      ? Math.round(clients.reduce((a, c) => a + calcScore(c), 0) / clients.length)
      : 0,
    lostPrice:  clients.filter(c => c.status === 'closed' && c.closedReason === 'price').length,
    lostNoRep:  clients.filter(c => c.status === 'closed' && c.closedReason === 'no_reply').length,
    lostComp:   clients.filter(c => c.status === 'closed' && c.closedReason === 'competitor').length,
  }
}
