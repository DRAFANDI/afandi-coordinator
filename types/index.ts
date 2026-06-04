// ═══════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════

export type Stage  = 'curious' | 'interested' | 'ready' | 'hesitant'
export type Status = 'new' | 'interested' | 'follow_up' | 'booked' | 'visited' | 'started_treatment' | 'closed'
export type TabId  = 'clients' | 'scripts' | 'mindset' | 'prices' | 'ai'

export interface TimelineEntry {
  date: string
  type: string
  text: string
}

export interface Client {
  id: number
  name: string
  phone: string
  source: string
  service: string
  concern: string
  stage: Stage
  status: Status
  lastContact: string
  nextAction: string
  nextFollowUpDate: string
  priceGiven: string
  notes: string
  closedReason: string
  timeline: TimelineEntry[]
}

export interface StageConfig {
  label: string
  color: string
  icon: string
  score: number
}

export interface StatusConfig {
  label: string
  color: string
  icon: string
  score: number
}

export interface Script {
  id: string
  category: string
  icon: string
  color: string
  title: string
  trigger: string
  psychology: string
  goal: string
  reply: string
  reply2?: string
  nextStep: string
}

export interface QuickAction {
  id: string
  icon: string
  label: string
  text: string
}

export interface ScoreLabel {
  icon: string
  color: string
  label: string
}

export interface FollowUpStatus {
  icon: string
  label: string
  color: string
}

export interface KPIData {
  new: number
  interested: number
  follow_up: number
  booked: number
  visited: number
  treatment: number
  closed: number
  followDue: number
  incomplete: number
  avgScore: number
  lostPrice: number
  lostNoRep: number
  lostComp: number
}
