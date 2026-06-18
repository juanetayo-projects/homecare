import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Diagnostico {
  id?: string
  codigo_cie10: string
  descripcion: string | null
  tipo: string | null
  riesgo_hemodinamico: boolean | null
  riesgo_vital: boolean | null
}

interface Cuidador {
  id?: string
  nombre: string
  parentesco: string | null
  telefono: string | null
  estado_civil: string | null
}

interface Vivienda {
  tipo_vivienda: string
  estrato: number | string
  habitaciones: number | string
  pisos: number | string
  banos: number | string
  cocina: string
  servicios_publicos: string[]
  observaciones: string
}

const tabs = [
  { id: 'datos', label: 'Datos Básicos', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'diagnosticos', label: 'Diagnósticos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'cuidadores', label: 'Cuidadores', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'vivienda', label: 'Vivienda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
]

const tiposIdentidad = ['CC', 'CE', 'TI', 'PA', 'RC']
const sexos = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
]
const estadosPaciente = ['Activo', 'Alta médica', 'Rechazado', 'Trasladado', 'Fallecido']
const tiposVia = ['Calle', 'Carrera', 'Avenida', 'Diagonal', 'Transversal', 'Kilómetro']
const estratos = [1, 2, 3, 4, 5, 6]
const tipoSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const estadosCiviles = ['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Unión libre']
const parentescos = ['Hijo(a)', 'Esposo(a)', 'Padre', 'Madre', 'Hermano(a)', 'Nieto(a)', 'Otro']
const tipoVivienda = ['Casa', 'Apartamento', 'Habitación', 'Cuarto', 'Otro']
const cocinaTipos = ['Propia', 'Compartida', 'No tiene']
const serviciosOptions = ['Agua', 'Luz', 'Gas', 'Alcantarillado', 'Teléfono', 'Internet']
const tiposDiagnostico = ['Principal', 'Secundario', 'Relacionado']

export default function PacientesForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [activeTab, setActiveTab] = useState('datos')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadingData, setLoadingData] = useState(isEdit)

  const [form, setForm] = useState({
    tipo_identidad: 'CC',
    identidad: '',
    nombres: '',
    apellidos: '',
    sexo: 'M',
    fecha_nacimiento: '',
    estado: 'Activo',
    entidad_id: '',
    rh: '',
    estado_civil: '',
    nivel_educativo: '',
    religion: '',
    etnia: '',
    tipo_paciente: 'Domiciliario',
    tipo_usuario: 'Particular',
    medico_tratante: '',
    telefono_fijo: '',
    telefono_movil: '',
    email: '',
    direccion: '',
    tipo_via: '',
    barrio: '',
    comuna: '',
    ciudad_atencion: '',
    ciudad_visita: '',
    periodo_visitas: '',
    aceptado: false,
    alto_riesgo: false,
  })

  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [cuidadores, setCuidadores] = useState<Cuidador[]>([])
  const [vivienda, setVivienda] = useState<Vivienda>({
    tipo_vivienda: '',
    estrato: '',
    habitaciones: '',
    pisos: '',
    banos: '',
    cocina: '',
    servicios_publicos: [],
    observaciones: '',
  })

  const [entidades, setEntidades] = useState<{ id: string; nombre: string }[]>([])

  useEffect(() => {
    supabase.from('entidades').select('id, nombre').order('nombre').then(({ data }) => {
      if (data) setEntidades(data)
    })
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      loadPaciente(id)
    }
  }, [id, isEdit])

  async function loadPaciente(pacienteId: string) {
    setLoadingData(true)
    const { data } = await supabase.from('pacientes').select('*').eq('id', pacienteId).single()
    if (data) {
      setForm({
        tipo_identidad: data.tipo_identidad || 'CC',
        identidad: data.identidad || '',
        nombres: data.nombres || '',
        apellidos: data.apellidos || '',
        sexo: data.sexo || 'M',
        fecha_nacimiento: data.fecha_nacimiento || '',
        estado: data.estado || 'Activo',
        entidad_id: data.entidad_id || '',
        rh: data.rh || '',
        estado_civil: data.estado_civil || '',
        nivel_educativo: data.nivel_educativo || '',
        religion: data.religion || '',
        etnia: data.etnia || '',
        tipo_paciente: data.tipo_paciente || 'Domiciliario',
        tipo_usuario: data.tipo_usuario || 'Particular',
        medico_tratante: data.medico_tratante || '',
        telefono_fijo: data.telefono_fijo || '',
        telefono_movil: data.telefono_movil || '',
        email: data.email || '',
        direccion: data.direccion || '',
        tipo_via: data.tipo_via || '',
        barrio: data.barrio || '',
        comuna: data.comuna || '',
        ciudad_atencion: data.ciudad_atencion || '',
        ciudad_visita: data.ciudad_visita || '',
        periodo_visitas: data.periodo_visitas || '',
        aceptado: data.aceptado || false,
        alto_riesgo: data.alto_riesgo || false,
      })
    }

    const { data: dias } = await supabase.from('paciente_diagnosticos').select('*').eq('paciente_id', pacienteId)
    if (dias) setDiagnosticos(dias)

    const { data: cuids } = await supabase.from('paciente_cuidadores').select('*').eq('paciente_id', pacienteId)
    if (cuids) setCuidadores(cuids)

    const { data: viv } = await supabase.from('paciente_vivienda').select('*').eq('paciente_id', pacienteId).single()
    if (viv) {
      setVivienda({
        tipo_vivienda: viv.tipo_vivienda || '',
        estrato: viv.estrato || '',
        habitaciones: viv.habitaciones || '',
        pisos: viv.pisos || '',
        banos: viv.banos || '',
        cocina: viv.cocina || '',
        servicios_publicos: viv.servicios_publicos || [],
        observaciones: viv.observaciones || '',
      })
    }

    setLoadingData(false)
  }

  function updateForm(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addDiagnostico() {
    setDiagnosticos([...diagnosticos, { codigo_cie10: '', descripcion: '', tipo: 'Principal', riesgo_hemodinamico: false, riesgo_vital: false }])
  }

  function updateDiagnostico(index: number, field: keyof Diagnostico, value: unknown) {
    setDiagnosticos((prev) => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  function removeDiagnostico(index: number) {
    setDiagnosticos((prev) => prev.filter((_, i) => i !== index))
  }

  function addCuidador() {
    setCuidadores([...cuidadores, { nombre: '', parentesco: '', telefono: '', estado_civil: '' }])
  }

  function updateCuidador(index: number, field: keyof Cuidador, value: unknown) {
    setCuidadores((prev) => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  function removeCuidador(index: number) {
    setCuidadores((prev) => prev.filter((_, i) => i !== index))
  }

  function toggleServicio(servicio: string) {
    setVivienda((prev) => ({
      ...prev,
      servicios_publicos: prev.servicios_publicos.includes(servicio)
        ? prev.servicios_publicos.filter((s) => s !== servicio)
        : [...prev.servicios_publicos, servicio],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { data: sedes } = await supabase.from('sedes').select('id').limit(1)
      if (!sedes || sedes.length === 0) {
        setError('No hay sedes configuradas')
        setSaving(false)
        return
      }

      const pacienteData = {
        ...form,
        sede_id: sedes[0].id,
        fecha_estado: form.estado !== 'Activo' ? new Date().toISOString() : null,
      }

      let pacienteId = id

      if (isEdit && id) {
        const { error: err } = await supabase.from('pacientes').update(pacienteData).eq('id', id)
        if (err) throw err
      } else {
        const { data, error: err } = await supabase.from('pacientes').insert(pacienteData).select('id').single()
        if (err) throw err
        pacienteId = data?.id
      }

      if (!pacienteId) throw new Error('No se pudo obtener el ID del paciente')

      await supabase.from('paciente_diagnosticos').delete().eq('paciente_id', pacienteId)
      if (diagnosticos.length > 0) {
        const diasInsert = diagnosticos.map((d) => ({
          paciente_id: pacienteId,
          codigo_cie10: d.codigo_cie10,
          descripcion: d.descripcion,
          tipo: d.tipo,
          riesgo_hemodinamico: d.riesgo_hemodinamico,
          riesgo_vital: d.riesgo_vital,
        }))
        await supabase.from('paciente_diagnosticos').insert(diasInsert)
      }

      await supabase.from('paciente_cuidadores').delete().eq('paciente_id', pacienteId)
      if (cuidadores.length > 0) {
        const cuidInsert = cuidadores.map((c) => ({
          paciente_id: pacienteId,
          nombre: c.nombre,
          parentesco: c.parentesco,
          telefono: c.telefono,
          estado_civil: c.estado_civil,
        }))
        await supabase.from('paciente_cuidadores').insert(cuidInsert)
      }

      await supabase.from('paciente_vivienda').delete().eq('paciente_id', pacienteId)
      const { servicios_publicos, ...viviendaRest } = vivienda
      if (viviendaRest.tipo_vivienda || vivienda.estrato) {
        await supabase.from('paciente_vivienda').insert({
          paciente_id: pacienteId,
          ...viviendaRest,
          estrato: vivienda.estrato ? Number(vivienda.estrato) : null,
          habitaciones: vivienda.habitaciones ? Number(vivienda.habitaciones) : null,
          pisos: vivienda.pisos ? Number(vivienda.pisos) : null,
          banos: vivienda.banos ? Number(vivienda.banos) : null,
          servicios_publicos: servicios_publicos.length > 0 ? servicios_publicos : null,
        })
      }

      navigate('/pacientes')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-500">Cargando paciente...</span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}</h1>
          <p className="text-sm text-gray-500 mt-1">{isEdit ? `Editando: ${form.nombres} ${form.apellidos}` : 'Complete los datos del paciente'}</p>
        </div>
        <button onClick={() => navigate('/pacientes')} className="text-gray-500 hover:text-gray-700 text-sm">
          ← Volver al listado
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#0D2D6B] bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D2D6B]" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'datos' && (
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Identificación
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Identidad</label>
                    <select value={form.tipo_identidad} onChange={(e) => updateForm('tipo_identidad', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      {tiposIdentidad.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Identidad *</label>
                    <input type="text" value={form.identidad} onChange={(e) => updateForm('identidad', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Datos Personales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
                    <input type="text" value={form.nombres} onChange={(e) => updateForm('nombres', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                    <input type="text" value={form.apellidos} onChange={(e) => updateForm('apellidos', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                    <select value={form.sexo} onChange={(e) => updateForm('sexo', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      {sexos.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fec. Nacimiento *</label>
                    <input type="date" value={form.fecha_nacimiento} onChange={(e) => updateForm('fecha_nacimiento', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grupo Sanguíneo</label>
                    <select value={form.rh} onChange={(e) => updateForm('rh', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">--</option>
                      {tipoSangre.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                    <select value={form.estado_civil} onChange={(e) => updateForm('estado_civil', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">--</option>
                      {estadosCiviles.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Educativo</label>
                    <input type="text" value={form.nivel_educativo} onChange={(e) => updateForm('nivel_educativo', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religión</label>
                    <input type="text" value={form.religion} onChange={(e) => updateForm('religion', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Etnia</label>
                    <input type="text" value={form.etnia} onChange={(e) => updateForm('etnia', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Clasificación
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                    <select value={form.estado} onChange={(e) => updateForm('estado', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      {estadosPaciente.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Paciente</label>
                    <input type="text" value={form.tipo_paciente} onChange={(e) => updateForm('tipo_paciente', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Usuario</label>
                    <input type="text" value={form.tipo_usuario} onChange={(e) => updateForm('tipo_usuario', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entidad (EPS)</label>
                    <select value={form.entidad_id} onChange={(e) => updateForm('entidad_id', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">-- Ninguna --</option>
                      {entidades.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Médico Tratante</label>
                    <input type="text" value={form.medico_tratante} onChange={(e) => updateForm('medico_tratante', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.aceptado} onChange={(e) => updateForm('aceptado', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#0D2D6B] focus:ring-[#0D2D6B]" />
                    <span className="text-sm text-gray-700">Aceptado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.alto_riesgo} onChange={(e) => updateForm('alto_riesgo', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className="text-sm text-gray-700">Alto Riesgo</span>
                  </label>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Contacto y Ubicación
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Fijo</label>
                    <input type="text" value={form.telefono_fijo} onChange={(e) => updateForm('telefono_fijo', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Móvil *</label>
                    <input type="text" value={form.telefono_movil} onChange={(e) => updateForm('telefono_movil', e.target.value)} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input type="text" value={form.direccion} onChange={(e) => updateForm('direccion', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Vía</label>
                    <select value={form.tipo_via} onChange={(e) => updateForm('tipo_via', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">--</option>
                      {tiposVia.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barrio</label>
                    <input type="text" value={form.barrio} onChange={(e) => updateForm('barrio', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                    <input type="text" value={form.comuna} onChange={(e) => updateForm('comuna', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad Atención</label>
                    <input type="text" value={form.ciudad_atencion} onChange={(e) => updateForm('ciudad_atencion', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'diagnosticos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Diagnósticos del Paciente</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Registre los diagnósticos CIE-10</p>
                </div>
                <button type="button" onClick={addDiagnostico} className="bg-[#0D2D6B] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#16468E] transition flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Agregar
                </button>
              </div>

              {diagnosticos.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No hay diagnósticos registrados</p>
                  <p className="text-xs text-gray-400 mt-1">Haga clic en "Agregar" para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {diagnosticos.map((diag, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500">Diagnóstico #{i + 1}</span>
                        <button type="button" onClick={() => removeDiagnostico(i)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Código CIE-10 *</label>
                          <input type="text" value={diag.codigo_cie10} onChange={(e) => updateDiagnostico(i, 'codigo_cie10', e.target.value)} required className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                          <input type="text" value={diag.descripcion ?? ''} onChange={(e) => updateDiagnostico(i, 'descripcion', e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                          <select value={diag.tipo ?? ''} onChange={(e) => updateDiagnostico(i, 'tipo', e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                            {tiposDiagnostico.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={diag.riesgo_hemodinamico ?? false} onChange={(e) => updateDiagnostico(i, 'riesgo_hemodinamico', e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                          <span className="text-xs text-gray-600">Riesgo Hemodinámico</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={diag.riesgo_vital ?? false} onChange={(e) => updateDiagnostico(i, 'riesgo_vital', e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                          <span className="text-xs text-gray-600">Riesgo Vital</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cuidadores' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Cuidadores / Responsables</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Personas responsables del paciente</p>
                </div>
                <button type="button" onClick={addCuidador} className="bg-[#0D2D6B] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#16468E] transition flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Agregar
                </button>
              </div>

              {cuidadores.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm">No hay cuidadores registrados</p>
                  <p className="text-xs text-gray-400 mt-1">Haga clic en "Agregar" para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cuidadores.map((cuid, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500">Cuidador #{i + 1}</span>
                        <button type="button" onClick={() => removeCuidador(i)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre Completo *</label>
                          <input type="text" value={cuid.nombre} onChange={(e) => updateCuidador(i, 'nombre', e.target.value)} required className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Parentesco</label>
                          <select value={cuid.parentesco ?? ''} onChange={(e) => updateCuidador(i, 'parentesco', e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                            <option value="">--</option>
                            {parentescos.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                          <input type="text" value={cuid.telefono ?? ''} onChange={(e) => updateCuidador(i, 'telefono', e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Estado Civil</label>
                        <select value={cuid.estado_civil ?? ''} onChange={(e) => updateCuidador(i, 'estado_civil', e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white max-w-xs">
                          <option value="">--</option>
                          {estadosCiviles.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'vivienda' && (
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Tipo de Vivienda
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Vivienda</label>
                    <select value={vivienda.tipo_vivienda} onChange={(e) => setVivienda({ ...vivienda, tipo_vivienda: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">-- Seleccionar --</option>
                      {tipoVivienda.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estrato</label>
                    <select value={vivienda.estrato} onChange={(e) => setVivienda({ ...vivienda, estrato: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">--</option>
                      {estratos.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cocina</label>
                    <select value={vivienda.cocina} onChange={(e) => setVivienda({ ...vivienda, cocina: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] bg-white">
                      <option value="">--</option>
                      {cocinaTipos.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Estructura
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Habitaciones</label>
                    <input type="number" min="0" value={vivienda.habitaciones} onChange={(e) => setVivienda({ ...vivienda, habitaciones: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Pisos</label>
                    <input type="number" min="0" value={vivienda.pisos} onChange={(e) => setVivienda({ ...vivienda, pisos: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Baños</label>
                    <input type="number" min="0" value={vivienda.banos} onChange={(e) => setVivienda({ ...vivienda, banos: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B]" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Servicios Públicos
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {serviciosOptions.map((serv) => (
                    <label key={serv} className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                      <input
                        type="checkbox"
                        checked={vivienda.servicios_publicos.includes(serv)}
                        onChange={() => toggleServicio(serv)}
                        className="w-4 h-4 rounded border-gray-300 text-[#0D2D6B] focus:ring-[#0D2D6B]"
                      />
                      <span className="text-sm text-gray-700">{serv}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0D2D6B]" />
                  Observaciones
                </h3>
                <textarea
                  value={vivienda.observaciones}
                  onChange={(e) => setVivienda({ ...vivienda, observaciones: e.target.value })}
                  rows={3}
                  placeholder="Condiciones especiales de la vivienda..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] resize-none"
                />
              </section>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
            <button type="button" onClick={() => navigate('/pacientes')} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-medium text-white bg-[#0D2D6B] hover:bg-[#16468E] rounded-lg transition disabled:opacity-50 shadow-sm flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : 'Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
