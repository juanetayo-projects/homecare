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
}

export default function PacientesList() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('pacientes')
        .select('id, identidad, apellidos, nombres, sexo, fecha_nacimiento, estado, entidad_id')
        .order('apellidos', { ascending: true })
        .limit(50)
      if (data) setPacientes(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-gray-500">Cargando pacientes...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <Link
          to="/pacientes/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
        >
          + Nuevo Paciente
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Identidad</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Paciente</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Sexo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Edad</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{p.identidad}</td>
                  <td className="px-4 py-3">
                    <Link to={`/pacientes/${p.id}`} className="text-blue-600 hover:text-blue-800">
                      {p.apellidos} {p.nombres}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.sexo}</td>
                  <td className="px-4 py-3 text-gray-600">-</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      p.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/pacientes/${p.id}`} className="text-blue-600 hover:text-blue-800 text-xs">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No hay pacientes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
