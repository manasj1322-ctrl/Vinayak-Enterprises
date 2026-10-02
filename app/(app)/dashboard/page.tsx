'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const BORDER = ['border-blue-500', 'border-gray-400', 'border-green-500', 'border-red-500', 'border-orange-500']
const BADGE = [
  'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  'bg-green-500/20 text-green-700 dark:text-green-300',
  'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  'bg-pink-500/20 text-pink-700 dark:text-pink-300',
  'bg-gray-500/20 text-gray-700 dark:text-gray-300',
]
const chip = (on: boolean) =>
  `px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${on
    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([]), [heads, setHeads] = useState<any[]>([]), [clients, setClients] = useState(0)
  const [search, setSearch] = useState(''), [head, setHead] = useState(''), [period, setPeriod] = useState('all')

  useEffect(() => {
    supabase.from('entries').select('id,entry_date,company,contact,address,remark,clients(name),headings(name)')
      .order('entry_date', { ascending: false }).order('id', { ascending: false }).then(({ data }) => setRows(data || []))
    supabase.from('clients').select('id', { count: 'exact', head: true }).then(({ count }) => setClients(count || 0))
    supabase.from('headings').select('id,name').order('name').then(({ data }) => setHeads(data || []))
  }, [])

  const today = new Date().toISOString().slice(0, 10), month = today.slice(0, 7), q = search.trim().toLowerCase()
  const list = rows.filter(r =>
    (!head || r.headings?.name === head) &&
    (period === 'all' || (period === 'today' ? r.entry_date === today : r.entry_date.startsWith(month))) &&
    (!q || [r.clients?.name, r.company, r.contact, r.address, r.remark].some(v => (v || '').toLowerCase().includes(q))))
  const stats = [
    [rows.length, 'Total Entries'],
    [rows.filter(r => r.entry_date === today).length, 'Today'],
    [rows.filter(r => r.entry_date.startsWith(month)).length, 'This Month'],
    [clients, 'Clients'],
    [heads.length, 'Headings'],
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link href="/entry" className="btn">+ New entry</Link>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5 mb-4">
        {stats.map(([n, l], i) => (
          <div key={l as string} className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-l-4 ${BORDER[i]} rounded px-4 py-3`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">{l}</span>
            <b className="block text-3xl text-gray-900 dark:text-white">{n}</b>
          </div>
        ))}
      </div>

      <div className="relative max-w-xs mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="inp !pl-8" placeholder="Client, company, contact..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <button className={chip(!head)} onClick={() => setHead('')}>All Entries</button>
          {heads.map(h => <button key={h.id} className={chip(head === h.name)} onClick={() => setHead(h.name)}>{h.name}</button>)}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          Period
          {[['all', 'All'], ['today', 'Today'], ['month', 'Month']].map(([k, l]) => <button key={k} className={chip(period === k)} onClick={() => setPeriod(k)}>{l}</button>)}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead><tr>{['Date', 'Client', 'Company', 'Contact', 'Heading', 'Address', 'Remark'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>
            {list.map(r => {
              const idx = Math.max(0, heads.findIndex(h => h.name === r.headings?.name))
              return (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="td text-gray-500">{r.entry_date}</td>
                  <td className="td font-semibold uppercase">{r.clients?.name}</td>
                  <td className="td">{r.company}</td>
                  <td className="td">{r.contact}</td>
                  <td className="td"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE[idx % BADGE.length]}`}>{r.headings?.name}</span></td>
                  <td className="td">{r.address}</td>
                  <td className="td">{r.remark}</td>
                </tr>
              )
            })}
            {!list.length && <tr><td className="td" colSpan={7}>No entries match</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">Showing {list.length} of {rows.length}</p>
    </div>
  )
}