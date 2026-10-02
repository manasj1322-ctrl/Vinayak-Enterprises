import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Add a heading; duplicates (case-insensitive) return the existing one.
export async function addHeading(name: string) {
  name = name.trim()
  const { data, error } = await supabase.from('headings').insert({ name }).select('id,name').single()
  if (!error) return data
  const { data: ex } = await supabase.from('headings').select('id,name').ilike('name', name).limit(1).single()
  return ex
}

// Upsert the client (client master = latest entry) and add the entry.
export async function saveEntry(f: any) {
  const client = f.client.trim(), contact = f.contact.trim(), company = f.company.trim(), address = f.address.trim()
  const { data: c, error } = await supabase.from('clients').upsert({ name: client, contact, company, address, heading_id: f.headingId }, { onConflict: 'name,contact' }).select('id').single()
  if (error || !c) return false
  const { error: e2 } = await supabase.from('entries').insert({ entry_date: f.date || new Date().toISOString().slice(0, 10), client_id: c.id, heading_id: f.headingId, company, contact, address, remark: f.remark.trim() })
  return !e2
}
