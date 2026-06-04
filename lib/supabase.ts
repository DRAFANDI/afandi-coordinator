import { createClient } from '@supabase/supabase-js'
import type { Client, Stage, Status, TimelineEntry } from '@/types'

// ═══════════════════════════════════════════════════════════
// CLIENT
// ═══════════════════════════════════════════════════════════

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

// ═══════════════════════════════════════════════════════════
// DATABASE ROW TYPE
// Matches the exact column names in Supabase
// ═══════════════════════════════════════════════════════════

export interface ClientRow {
  id:                 number
  name:               string
  phone:              string | null
  source:             string | null
  service:            string | null
  concern:            string | null
  stage:              string | null
  status:             string | null
  last_contact:       string | null
  next_action:        string | null
  next_followup_date: string | null
  price_given:        string | null
  notes:              string | null
  closed_reason:      string | null
  created_at:         string | null
}

// ═══════════════════════════════════════════════════════════
// MAPPERS — DB ↔ App
// ═══════════════════════════════════════════════════════════

// DB row → App Client (camelCase, with empty timeline)
export function rowToClient(row: ClientRow): Client {
  return {
    id:               row.id,
    name:             row.name             ?? '',
    phone:            row.phone            ?? '',
    source:           row.source           ?? 'واتساب',
    service:          row.service          ?? 'قشور إيماكس',
    concern:          row.concern          ?? 'السعر',
    stage:           (row.stage            ?? 'curious')  as Stage,
    status:          (row.status           ?? 'new')      as Status,
    lastContact:      row.last_contact     ?? '',
    nextAction:       row.next_action      ?? '',
    nextFollowUpDate: row.next_followup_date ?? '',
    priceGiven:       row.price_given      ?? '',
    notes:            row.notes            ?? '',
    closedReason:     row.closed_reason    ?? '',
    timeline:         [],   // timeline is local-only for now
  }
}

// App Client → DB row (snake_case, only persistable fields)
export function clientToRow(c: Partial<Client>): Partial<Omit<ClientRow, 'id' | 'created_at'>> {
  const row: Partial<Omit<ClientRow, 'id' | 'created_at'>> = {}

  if (c.name             !== undefined) row.name               = c.name
  if (c.phone            !== undefined) row.phone              = c.phone
  if (c.source           !== undefined) row.source             = c.source
  if (c.service          !== undefined) row.service            = c.service
  if (c.concern          !== undefined) row.concern            = c.concern
  if (c.stage            !== undefined) row.stage              = c.stage
  if (c.status           !== undefined) row.status             = c.status
  if (c.lastContact      !== undefined) row.last_contact       = c.lastContact      || null
  if (c.nextAction       !== undefined) row.next_action        = c.nextAction       || null
  if (c.nextFollowUpDate !== undefined) row.next_followup_date = c.nextFollowUpDate || null
  if (c.priceGiven       !== undefined) row.price_given        = c.priceGiven       || null
  if (c.notes            !== undefined) row.notes              = c.notes            || null
  if (c.closedReason     !== undefined) row.closed_reason      = c.closedReason     || null

  return row
}

// ═══════════════════════════════════════════════════════════
// DB OPERATIONS
// ═══════════════════════════════════════════════════════════

// Fetch all clients, newest first
export async function fetchAllClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as ClientRow[]).map(rowToClient)
}

// Insert a new client — returns the inserted row with its real id
export async function insertClient(
  c: Omit<Client, 'id' | 'timeline'>
): Promise<Client> {
  const row = clientToRow(c)

  const { data, error } = await supabase
    .from('clients')
    .insert(row)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return rowToClient(data as ClientRow)
}

// Update an existing client by id
export async function updateClientInDB(
  id: number,
  changes: Partial<Client>
): Promise<void> {
  const row = clientToRow(changes)
  if (Object.keys(row).length === 0) return   // nothing to update

  const { error } = await supabase
    .from('clients')
    .update(row)
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// Delete a client by id
export async function deleteClientFromDB(id: number): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
