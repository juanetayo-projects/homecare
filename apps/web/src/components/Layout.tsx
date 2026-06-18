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
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Sede activa: <strong className="text-gray-700">ADT Palmira</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
