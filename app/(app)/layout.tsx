'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(), [ok, setOk] = useState(false)
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (!data.session) router.replace('/login'); else setOk(true) }) }, [])
  if (!ok) return null
  return (<><NavBar /><main className="bos-main pt-12 md:pt-0 min-h-screen"><div className="p-4 md:p-6">{children}</div></main></>)
}

