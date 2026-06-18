import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Paciente {
  id: string
  identidad: string
  apellidos: string
  nombres: string
  sexo: string
  fecha_nacimiento: string
  estado: string
  entidad_id: string | null
  telefono_movil: string | null
  direccion: string | null
  created_at: string
  entidades?: { nombre: string } | null
}

function calcularEdad(fechaNacimiento: string): string {
  if (!fechaNacimiento) return '-'
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  let anios = hoy.getFullYear() - nac.getFullYear()
  const meses = hoy.getMonth() - nac.getMonth()
  if (meses < 0 || (meses === 0 && hoy.getDate() < nac.getDate())) {
    anios--
  }
  return `${anios} años`
}

export default function PacientesList() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('pacientes')
        .select('id, identidad, apellidos, nombres, sexo, fecha_nacimiento, estado, entidad_id, telefono_movil, direccion, created_at, entidades(nombre)')
        .order('apellidos', { ascending: true })
        .limit(200)
      if (data) setPacientes(data as unknown as Paciente[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = pacientes.filter((p) => {
    const matchSearch = !search ||
      `${p.nombres} ${p.apellidos} ${p.identidad}`.toLowerCase().includes(search.toLowerCase())
    const matchEstado = !filtroEstado || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  const estadosUnicos = [...new Set(pacientes.map((p) => p.estado))].filter(Boolean)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">{pacientes.length} pacientes registrados</p>
        </div>
        <Link
          to="/pacientes/nuevo"
          className="bg-[#0D2D6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#16468E] transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Paciente
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, apellido o documento..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white"
            >
              <option value="">Todos los estados</option>
              {estadosUnicos.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Documento</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Paciente</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Sexo</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Edad</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Entidad</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Teléfono</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Cargando pacientes...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">
                      {search || filtroEstado ? 'No se encontraron pacientes con esos filtros' : 'No hay pacientes registrados'}
                    </p>
                    {!search && !filtroEstado && (
                      <Link to="/pacientes/nuevo" className="inline-block mt-3 text-sm text-[#0D2D6B] hover:underline font-medium">
                        + Registrar primer paciente
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{p.identidad}</td>
                    <td className="px-4 py-3">
                      <Link to={`/pacientes/${p.id}`} className="text-[#0D2D6B] hover:text-[#16468E] font-medium hover:underline">
                        {p.apellidos} {p.nombres}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.sexo === 'M' ? 'M' : 'F'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{calcularEdad(p.fecha_nacimiento)}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px] truncate" title={p.entidades?.nombre || ''}>
                      {p.entidades?.nombre || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.telefono_movil || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        p.estado === 'Activo' ? 'bg-green-100 text-green-700' :
                        p.estado === 'Alta médica' ? 'bg-blue-100 text-blue-700' :
                        p.estado === 'Rechazado' ? 'bg-red-100 text-red-700' :
                        p.estado === 'Trasladado' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/pacientes/${p.id}`} className="text-[#0D2D6B] hover:text-[#16468E] text-xs font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition">
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
            Mostrando {filtered.length} de {pacientes.length} pacientes
          </div>
        )}
      </div>
    </div>
  )
}
