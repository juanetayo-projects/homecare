import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const signIn = useAuthStore((s) => s.signIn)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/homecare/images/logo_cacsb2.png" alt="HomeCare Soft" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#0D2D6B]">HomeCare Soft</h1>
          <p className="text-[#4A8AD4] mt-2">Iniciar sesión</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        {recoveryMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{recoveryMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-[#0D2D6B] text-white py-2 rounded-md hover:bg-[#16468E] transition"
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
  )
}
