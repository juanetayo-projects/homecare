import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import Sidebar from './Sidebar'

export default function Layout() {
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0D2D6B] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/homecare/images/logo_cacsb_blanc.png" alt="Logo" className="h-8" />
            <span className="text-sm text-white/80">
              Sede activa: <strong className="text-white">ADT Palmira</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-sm text-white hover:text-white/70 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
