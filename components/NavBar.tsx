'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, FilePlus2, Database, BarChart3, Sun, Moon, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },

  { href: '/entry', label: 'Entry', icon: FilePlus2 },
  { href: '/master', label: 'Master', icon: Database },
  { href: '/report', label: 'Report', icon: BarChart3 },
]
const W = 224

export default function NavBar() {
  const pathname = usePathname(), router = useRouter(), { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false), [email, setEmail] = useState('')
  const [open, setOpen] = useState(false), [collapsed, setCollapsed] = useState(false)
  useEffect(() => { setMounted(true); supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || '')) }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  async function signOut() { await supabase.auth.signOut(); router.push('/login'); router.refresh() }

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex flex-col items-start">
          <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Vinayak Enterprises</span>
          <p className="text-xs text-gray-400 mt-0.5">Client Tracker</p>
        </Link>
        <button onClick={() => setOpen(false)} className="md:hidden p-1 text-gray-400"><X size={20} /></button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(l => {
          const active = pathname.startsWith(l.href)
          return (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <l.icon size={16} />{l.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
        {email && <p className="text-xs text-gray-400 truncate">{email}</p>}
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors"><LogOut size={14} /> Sign Out</button>
        {mounted && (
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        )}
        <p className="text-xs text-gray-400">v1.0</p>
      </div>
    </div>
  )

  return (
    <>
      <style>{`@media(min-width:768px){.bos-main{margin-left:${collapsed ? 0 : W}px!important}}`}</style>
      {!collapsed && <aside className="hidden md:flex fixed top-0 left-0 h-screen w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-10">{content}</aside>}
      <button onClick={() => setCollapsed(c => !c)} style={{ left: collapsed ? 0 : W }} className="hidden md:flex fixed top-6 z-20 items-center justify-center w-5 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-r-full shadow-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all">
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
      <div className="md:hidden fixed top-0 left-0 right-0 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 z-20">
        <button onClick={() => setOpen(true)} className="p-1 text-gray-600 dark:text-gray-400"><Menu size={22} /></button>
        <span className="ml-3 font-semibold text-gray-800 dark:text-white text-sm">Vinayak Enterprises</span>
      </div>
      {open && (<>
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />
        <aside className="md:hidden fixed top-0 left-0 h-screen w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-40">{content}</aside>
      </>)}
    </>
  )
}


