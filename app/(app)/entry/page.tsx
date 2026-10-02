'use client'
import { useEffect, useState } from 'react'
import { supabase, addHeading, saveEntry } from '@/lib/supabase'
const today = () => new Date().toISOString().slice(0, 10)
const blank = { date: today(), client: '', headingId: '', company: '', contact: '', address: '', remark: '' }
const J = { 'Content-Type': 'application/json' }

export default function Entry() {
  const [f, setF] = useState<any>(blank), [heads, setHeads] = useState<any[]>([]), [msg, setMsg] = useState('')
  const load = async () => { const { data } = await supabase.from('headings').select('id,name').order('name'); setHeads(data || []) }
  useEffect(() => { load() }, [])
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
  async function pickHead(e: any) {
    if (e.target.value !== '__new') return set('headingId')(e)
    const name = prompt('New heading name:'); if (!name?.trim()) return
    const h: any = await addHeading(name)
    await load(); setF({ ...f, headingId: String(h.id) })
  }
  async function save() {
    if (!f.client.trim() || !f.headingId) { setMsg('Client name and heading are required'); return }
    const ok = await saveEntry(f)
    if (ok) { setF({ ...blank, date: f.date }); setMsg('Saved ✓') } else setMsg('Error saving')
    setTimeout(() => setMsg(''), 2500)
  }
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Entry</h1>
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div><label className="lbl">Date</label><input type="date" className="inp" value={f.date} onChange={set('date')} /></div>
          <div><label className="lbl">Client name *</label><input className="inp" value={f.client} onChange={set('client')} /></div>
          <div><label className="lbl">Heading (Industry) *</label>
            <select className="inp" value={f.headingId} onChange={pickHead}>
              <option value="">Select heading…</option>
              {heads.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              <option value="__new">+ Add new heading…</option>
            </select></div>
          <div><label className="lbl">Company name</label><input className="inp" value={f.company} onChange={set('company')} /></div>
          <div><label className="lbl">Contact no.</label><input type="tel" className="inp" value={f.contact} onChange={set('contact')} /></div>
          <div><label className="lbl">Address (Location)</label><input className="inp" value={f.address} onChange={set('address')} /></div>
        </div>
        <div className="mt-3"><label className="lbl">Remark</label><textarea className="inp min-h-[70px]" value={f.remark} onChange={set('remark')} /></div>
        <div className="mt-3 flex items-center gap-3"><button className="btn" onClick={save}>Save entry</button><span className="text-sm text-gray-500">{msg}</span></div>
      </div>
    </div>
  )
}
