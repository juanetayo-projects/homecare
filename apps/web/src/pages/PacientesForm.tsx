import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PacientesForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    tipo_identidad: 'CC',
    identidad: '',
    apellidos: '',
    nombres: '',
    sexo: 'M',
    fecha_nacimiento: '',
    estado: 'Activo',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data: sedes } = await supabase.from('sedes').select('id').limit(1)
    if (!sedes || sedes.length === 0) {
      setError('No hay sedes configuradas')
      setSaving(false)
      return
    }

    const { error: err } = await supabase.from('pacientes').insert({
      ...form,
      sede_id: sedes[0].id,
    })

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    navigate('/pacientes')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Paciente</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Identidad</label>
            <select
              value={form.tipo_identidad}
              onChange={(e) => setForm({ ...form, tipo_identidad: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="CC">CC</option>
              <option value="CE">CE</option>
              <option value="TI">TI</option>
              <option value="PA">PA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">N° Identidad</label>
            <input
              type="text"
              value={form.identidad}
              onChange={(e) => setForm({ ...form, identidad: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <input
              type="text"
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
            <input
              type="text"
              value={form.nombres}
              onChange={(e) => setForm({ ...form, nombres: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
            <select
              value={form.sexo}
              onChange={(e) => setForm({ ...form, sexo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fec. Nacimiento</label>
            <input
              type="date"
              value={form.fecha_nacimiento}
              onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="Activo">Activo</option>
              <option value="Alta médica">Alta médica</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Trasladado">Trasladado</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/pacientes')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
