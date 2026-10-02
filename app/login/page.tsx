'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false), [error, setError] = useState('')
  async function handleLogin() {
    if (!email || !password) { setError('Enter email and password'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/dashboard'); router.refresh()
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-sm shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Vinayak Enterprises</h1>
          <p className="text-sm text-gray-500 mt-1">Client Tracker · Sign in to continue</p>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="your@email.com" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" autoFocus /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="w-full bg-black text-white py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">{loading ? 'Signing in...' : 'Sign In'}</button>
        </div>
      </div>
    </div>
  )
}

