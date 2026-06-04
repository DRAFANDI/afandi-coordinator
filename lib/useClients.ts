'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Client, Stage, Status } from '@/types'
import { EMPTY_CLIENT } from '@/data/constants'
import { makeEntry, calcKPIs, isPriority } from '@/lib/helpers'
import {
  fetchAllClients,
  insertClient,
  updateClientInDB,
  deleteClientFromDB,
} from '@/lib/supabase'

// ═══════════════════════════════════════════════════════════
// FILTERS TYPE
// ═══════════════════════════════════════════════════════════

export interface Filters {
  stage:    string
  status:   string
  source:   string
  service:  string
  concern:  string
  search:   string
  priority: boolean
}

const DEFAULT_FILTERS: Filters = {
  stage: '', status: '', source: '', service: '', concern: '', search: '', priority: false,
}

// ═══════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════

export function useClients() {
  const [clients,    setClients]    = useState<Client[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [filters,    setFilters]    = useState<Filters>(DEFAULT_FILTERS)
  const [noteInput,  setNoteInput]  = useState<Record<number, string>>({})

  // ── INITIAL FETCH ────────────────────────────────────────

  const loadClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAllClients()
      setClients(data)
    } catch (err: any) {
      setError(err.message ?? 'حدث خطأ في تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadClients() }, [loadClients])

  // ── ADD CLIENT ───────────────────────────────────────────

  const addClient = useCallback(async (data: Omit<Client, 'id' | 'timeline'>) => {
    try {
      const saved = await insertClient(data)
      const entry = makeEntry('created', `تم إضافة العميل — ${data.service}`)
      // Prepend with local timeline
      setClients(prev => [{ ...saved, timeline: [entry] }, ...prev])
    } catch (err: any) {
      setError(err.message ?? 'فشل في إضافة العميل')
    }
  }, [])

  // ── UPDATE CLIENT ────────────────────────────────────────

  const updateClient = useCallback(async (
    id: number,
    changes: Partial<Client>,
    timelineText?: string
  ) => {
    // Optimistic UI update first
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c
      const entry    = timelineText ? makeEntry('update', timelineText) : null
      const timeline = entry ? [entry, ...c.timeline] : c.timeline
      return { ...c, ...changes, timeline }
    }))

    // Persist to Supabase (timeline is local-only)
    try {
      await updateClientInDB(id, changes)
    } catch (err: any) {
      setError(err.message ?? 'فشل في تحديث العميل')
      // Rollback
      await loadClients()
    }
  }, [loadClients])

  // ── CHANGE STATUS ────────────────────────────────────────

  const changeStatus = useCallback((
    id: number,
    status: Status,
    onNeedReason: (id: number) => void
  ) => {
    if (status === 'closed') { onNeedReason(id); return }
    updateClient(id, { status }, `الحالة → ${STATUSES_LABELS[status] ?? status}`)
  }, [updateClient])

  // ── CHANGE STAGE ─────────────────────────────────────────

  const changeStage = useCallback((id: number, stage: Stage) => {
    updateClient(id, { stage }, `المرحلة → ${STAGES_LABELS[stage] ?? stage}`)
  }, [updateClient])

  // ── CLOSE WITH REASON ────────────────────────────────────

  const closeWithReason = useCallback((id: number, reason: string) => {
    updateClient(
      id,
      { status: 'closed', closedReason: reason },
      `مغلق — السبب: ${reason}`
    )
  }, [updateClient])

  // ── DELETE CLIENT ────────────────────────────────────────

  const deleteClient = useCallback(async (id: number) => {
    // Optimistic remove
    setClients(prev => prev.filter(c => c.id !== id))

    try {
      await deleteClientFromDB(id)
    } catch (err: any) {
      setError(err.message ?? 'فشل في حذف العميل')
      // Rollback
      await loadClients()
    }
  }, [loadClients])

  // ── QUICK ACTIONS (local timeline only) ──────────────────

  const addQuickAction = useCallback((id: number, actionText: string) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c
      const entry = makeEntry('action', actionText)
      return {
        ...c,
        lastContact: new Date().toISOString().split('T')[0],
        timeline: [entry, ...c.timeline],
      }
    }))
  }, [])

  // ── MANUAL NOTE (local timeline only) ────────────────────

  const addManualNote = useCallback((id: number) => {
    const text = noteInput[id]?.trim()
    if (!text) return
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c
      const entry = makeEntry('note', text)
      return { ...c, timeline: [entry, ...c.timeline] }
    }))
    setNoteInput(prev => ({ ...prev, [id]: '' }))
  }, [noteInput])

  // ── FILTERS ───────────────────────────────────────────────

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  const filteredClients = useMemo(() => clients.filter(c => {
    if (filters.stage   && c.stage   !== filters.stage)   return false
    if (filters.status  && c.status  !== filters.status)  return false
    if (filters.source  && c.source  !== filters.source)  return false
    if (filters.service && c.service !== filters.service) return false
    if (filters.concern && c.concern !== filters.concern) return false
    if (filters.priority && !isPriority(c))               return false
    if (filters.search  &&
        !c.name.includes(filters.search) &&
        !c.phone.includes(filters.search)) return false
    return true
  }), [clients, filters])

  // ── KPIs ──────────────────────────────────────────────────

  const kpis = useMemo(() => calcKPIs(clients), [clients])

  // ── RETURN ────────────────────────────────────────────────

  return {
    clients,
    filteredClients,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    noteInput,
    setNoteInput,
    kpis,
    addClient,
    updateClient,
    changeStatus,
    changeStage,
    closeWithReason,
    deleteClient,
    addQuickAction,
    addManualNote,
    emptyClient: { ...EMPTY_CLIENT },
  }
}

// ── LOCAL LABEL MAPS (avoid circular import from constants) ──

const STAGES_LABELS: Record<string, string> = {
  curious:    'فضول',
  interested: 'اهتمام',
  ready:      'قرار',
  hesitant:   'تردد',
}

const STATUSES_LABELS: Record<string, string> = {
  new:               'جديد',
  interested:        'مهتم',
  follow_up:         'متابعة',
  booked:            'محجوز',
  visited:           'زار العيادة',
  started_treatment: 'بدأ العلاج',
  closed:            'مغلق',
}
