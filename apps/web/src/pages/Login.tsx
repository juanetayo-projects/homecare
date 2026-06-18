import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'

interface Sede {
  id: string
  nombre: string
  ciudad: string
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [sedes, setSedes] = useState<Sede[]>([])
  const [sedeId, setSedeId] = useState('')
  const signIn = useAuthStore((s) => s.signIn)
  const setSedeActiva = useAuthStore((s) => s.setSedeActiva)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('sedes').select('id, nombre, ciudad').order('nombre').then(({ data }) => {
      if (data) {
        setSedes(data)
        if (data.length > 0) setSedeId(data[0].id)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      setSedeActiva(sedeId)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  const handleRecovery = async () => {
    if (!email) {
      setError('Ingresa tu correo electrónico primero')
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setRecoveryMessage('Se ha enviado un enlace de recuperación a tu correo')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo de recuperación')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D2D6B]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-[#16468E] px-8 py-6 text-center">
          <img src="/homecare/images/logo_cacsb_blanc.png" alt="HomeCare Soft" className="h-16 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">HomeCare Soft</h1>
          <p className="text-blue-200 text-sm mt-1">Inicio de sesión</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
          )}

          {recoveryMessage && (
            <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{recoveryMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede
              </label>
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E5DB6] bg-white"
                required
              >
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} - {s.ciudad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E5DB6]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E5DB6]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D2D6B] text-white py-2 rounded-md hover:bg-[#16468E] transition font-medium"
            >
              Ingresar
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleRecovery}
                className="text-sm text-[#1E5DB6] hover:text-[#0D2D6B] transition-colors"
              >
                Recuperar contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
