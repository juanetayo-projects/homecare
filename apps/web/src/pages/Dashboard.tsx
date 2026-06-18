import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    pacientes: 0,
    historias: 0,
    citas: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const { count: pacientes } = await supabase.from('pacientes').select('*', { count: 'exact', head: true })
      const { count: historias } = await supabase.from('historias').select('*', { count: 'exact', head: true })
      const { count: citas } = await supabase.from('citas').select('*', { count: 'exact', head: true })
      setStats({
        pacientes: pacientes ?? 0,
        historias: historias ?? 0,
        citas: citas ?? 0,
      })
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'Pacientes', value: stats.pacientes, color: 'bg-blue-500' },
    { label: 'Historias Clínicas', value: stats.historias, color: 'bg-green-500' },
    { label: 'Citas Programadas', value: stats.citas, color: 'bg-purple-500' },
    { label: 'Servicios Activos', value: 0, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.color} opacity-20`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
