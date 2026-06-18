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
  const [step, setStep] = useState<'credentials' | 'sede'>('credentials')
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
    if (step === 'credentials') {
      setError('')
      try {
        await signIn(email, password)
        setStep('sede')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
      }
      return
    }
    setSedeActiva(sedeId)
    navigate('/')
  }

  const handleRecovery = async () => {
    if (!email) {
      setError('Ingresa tu correo electrónico primero')
      return
    }
    try {
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      })
      if (error) throw error
      setRecoveryMessage('Se ha enviado un enlace de recuperación a tu correo')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo de recuperación')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2D6B] via-[#0D2D6B] to-[#1a3a7a]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#0D2D6B] px-8 py-7 text-center border-b border-[#16468E]">
          <img src="/homecare/images/logo_cacsb_blanc.png" alt="HomeCare Soft" className="h-14 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-white tracking-tight">HomeCare Soft</h1>
          <p className="text-blue-300 text-xs mt-1 font-light">Sistema de Gestión Clínica Domiciliaria</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              {error}
            </div>
          )}

          {recoveryMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              {recoveryMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent transition"
                placeholder="ejemplo@correo.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sede
              </label>
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent bg-white transition"
                required
              >
                <option value="">-- Seleccionar sede --</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} - {s.ciudad}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D2D6B] text-white py-2.5 rounded-lg hover:bg-[#16468E] transition font-medium text-sm shadow-sm"
            >
              Ingresar
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleRecovery}
                className="text-sm text-[#1E5DB6] hover:text-[#0D2D6B] transition-colors underline underline-offset-2"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>

        <div className="px-8 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} TodoMed SAS</p>
        </div>
      </div>
    </div>
  )
}
