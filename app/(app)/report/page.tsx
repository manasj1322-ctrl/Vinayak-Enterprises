'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Report() {
  const [heads, setHeads] = useState<any[]>([]), [rows, setRows] = useState<any[]>([])
  const [h, setH] = useState(''), [from, setFrom] = useState(''), [to, setTo] = useState('')
  useEffect(() => { supabase.from('headings').select('id,name').order('name').then(({ data }) => setHeads(data || [])) }, [])
  const load = async () => {
    let q = supabase.from('entries').select('id,entry_date,company,contact,address,remark,clients(name),headings(name)').order('entry_date', { ascending: false }).order('id', { ascending: false })
    if (h) q = q.eq('heading_id', h)
    if (from) q = q.gte('entry_date', from)
    if (to) q = q.lte('entry_date', to)
    const { data } = await q
    setRows((data || []).map((r: any) => ({ id: r.id, date: r.entry_date, client: r.clients?.name || '', heading: r.headings?.name || '', company: r.company, contact: r.contact, address: r.address, remark: r.remark })))
  }
  useEffect(() => { load() }, [h, from, to])
  async function del(id: number) { if (!confirm('Delete this entry?')) return; await supabase.from('entries').delete().eq('id', id); load() }
  const counts = heads.map(x => [x.name, rows.filter(r => r.heading === x.name).length] as [string, number])
  const max = Math.max(1, ...counts.map(c => c[1]))
  const stats = [[rows.length, 'Entries'], [new Set(rows.map(r => r.client.toLowerCase())).size, 'Clients'], [counts.filter(c => c[1]).length, 'Headings used']]
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report</h1>
      <div className="card grid gap-3 sm:grid-cols-4 items-end">
        <div><label className="lbl">Heading</label><select className="inp" value={h} onChange={e => setH(e.target.value)}><option value="">All headings</option>{heads.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
        <div><label className="lbl">From</label><input type="date" className="inp" value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div><label className="lbl">To</label><input type="date" className="inp" value={to} onChange={e => setTo(e.target.value)} /></div>
        <button className="btn" onClick={() => { setH(''); setFrom(''); setTo('') }}>Clear</button>
      </div>
      <div className="card">
        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">Summary by heading</p>
        <div className="flex flex-wrap gap-3 mb-4">{stats.map(([n, l]) => <div key={l as string} className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"><b className="block text-xl text-gray-900 dark:text-white">{n}</b><span className="text-xs text-gray-500">{l}</span></div>)}</div>
        {counts.map(([n, c]) => <div key={n} className="flex items-center gap-3 my-1.5 text-sm text-gray-700 dark:text-gray-300"><span className="w-36 truncate">{n}</span><div className="flex-1"><div className="h-2 rounded bg-gray-900 dark:bg-white" style={{ width: `${c / max * 100}%` }} /></div><b className="w-6 text-right">{c}</b></div>)}
      </div>
      <div className="card">
        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">Entries</p>
        <div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead><tr>{['Date', 'Client', 'Heading', 'Company', 'Contact', 'Address', 'Remark', ''].map(x => <th key={x} className="th">{x}</th>)}</tr></thead>
          <tbody>{rows.map(r => <tr key={r.id}><td className="td">{r.date}</td><td className="td">{r.client}</td><td className="td">{r.heading}</td><td className="td">{r.company}</td><td className="td">{r.contact}</td><td className="td">{r.address}</td><td className="td">{r.remark}</td><td className="td"><button onClick={() => del(r.id)} className="text-red-500 hover:text-red-700">✕</button></td></tr>)}
            {!rows.length && <tr><td className="td" colSpan={8}>No entries match</td></tr>}</tbody></table></div>
      </div>
    </div>
  )
}
