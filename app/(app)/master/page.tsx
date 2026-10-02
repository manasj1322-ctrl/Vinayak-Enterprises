'use client'
import { useEffect, useState } from 'react'
import { supabase, addHeading } from '@/lib/supabase'

export default function Master() {
  const [heads, setHeads] = useState<any[]>([]), [clients, setClients] = useState<any[]>([]), [name, setName] = useState('')
  const load = async () => {
    const { data: hs } = await supabase.from('headings').select('id,name,entries(count)').order('name')
    setHeads((hs || []).map((x: any) => ({ ...x, entry_count: x.entries?.[0]?.count ?? 0 })))
    const { data: cs } = await supabase.from('clients').select('id,name,contact,address,company,headings(name)').order('id', { ascending: false })
    setClients(cs || [])
  }
  useEffect(() => { load() }, [])
  async function add() {
    if (!name.trim()) return
    await addHeading(name)
    setName(''); load()
  }
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Master</h1>
      <div className="card">
        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">Heading master <span className="font-normal text-gray-400">(industry)</span></p>
        <div className="flex gap-2 mb-3 max-w-md"><input className="inp" placeholder="e.g. Real Estate" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} /><button className="btn" onClick={add}>Add</button></div>
        <div className="flex flex-wrap gap-2">{heads.map(h => <span key={h.id} className="border border-gray-200 dark:border-gray-700 rounded-full px-3 py-0.5 text-xs text-gray-700 dark:text-gray-300">{h.name} · {h.entry_count}</span>)}</div>
      </div>
      <div className="card">
        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">Client master</p>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px]"><thead><tr>{['Client', 'Contact', 'Address', 'Company', 'Heading'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>{clients.map(c => <tr key={c.id}><td className="td">{c.name}</td><td className="td">{c.contact}</td><td className="td">{c.address}</td><td className="td">{c.company}</td><td className="td">{c.headings?.name}</td></tr>)}
            {!clients.length && <tr><td className="td" colSpan={5}>No clients yet</td></tr>}</tbody></table></div>
      </div>
    </div>
  )
}
