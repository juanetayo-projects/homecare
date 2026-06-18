import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import Sidebar from './Sidebar'

export default function Layout() {
  const signOut = useAuthStore((s) => s.signOut)
  const sedeActiva = useAuthStore((s) => s.sedeActiva)
  const [sedeNombre, setSedeNombre] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (sedeActiva) {
      supabase.from('sedes').select('nombre').eq('id', sedeActiva).single().then(({ data }) => {
        if (data) setSedeNombre(data.nombre as string)
      })
    }
  }, [sedeActiva])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0D2D6B] text-white h-14 flex items-center justify-between px-6 shadow-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#16468E] flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-medium text-sm">{sedeNombre || 'HomeCare Soft'}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#16468E]/50"
            >
              <div className="w-7 h-7 rounded-full bg-[#16468E] flex items-center justify-center text-xs font-medium text-white">
                {sedeNombre?.charAt(0) || 'U'}
              </div>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
