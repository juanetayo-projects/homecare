import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import Sidebar from './Sidebar'

export default function Layout() {
  const signOut = useAuthStore((s) => s.signOut)
  const sedeActiva = useAuthStore((s) => s.sedeActiva)
  const [sedeNombre, setSedeNombre] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (sedeActiva) {
      supabase.from('sedes').select('nombre').eq('id', sedeActiva).single().then(({ data }) => {
        if (data) setSedeNombre(data.nombre)
      })
    }
  }, [sedeActiva])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#16468E] text-white px-6 py-3 flex items-center justify-between shadow-sm">
          <span className="text-white font-medium">{sedeNombre || 'HomeCare Soft'}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
