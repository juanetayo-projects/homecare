import { useState, useEffect } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'
import { supabase } from '../../lib/supabase'

const columns: Column[] = [
  {
    key: 'entidad_id',
    label: 'Entidad',
    render: (r) => <EntidadLabel id={r.entidad_id as string} />,
  },
  { key: 'numero', label: 'Número' },
  { key: 'fecha_inicial', label: 'Fecha Inicial' },
  { key: 'fecha_final', label: 'Fecha Final' },
  {
    key: 'valor',
    label: 'Valor',
    render: (r) => (r.valor != null ? `$${Number(r.valor).toLocaleString('es-CO')}` : '-'),
  },
  {
    key: 'activo',
    label: 'Activo',
    render: (r) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${r.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {r.activo ? 'Sí' : 'No'}
      </span>
    ),
  },
]

function EntidadLabel({ id }: { id: string }) {
  const [nombre, setNombre] = useState(id)
  useEffect(() => {
    supabase.from('entidades').select('nombre').eq('id', id).single().then(({ data: d }) => {
      if (d) setNombre((d as { nombre: string }).nombre)
    })
  }, [id])
  return <>{nombre}</>
}

export default function ContratosPage() {
  const { data, loading, create, update, remove } = useCrud('contratos', 'numero')
  const [entidades, setEntidades] = useState<{ value: string; label: string }[]>([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    supabase.from('entidades').select('id, nombre').order('nombre').then(({ data: d }) => {
      if (d) setEntidades((d as { id: string; nombre: string }[]).map((e) => ({ value: e.id, label: e.nombre })))
    })
  }, [])

  const fields = [
    { name: 'entidad_id', label: 'Entidad', type: 'select' as const, required: true, options: entidades },
    { name: 'numero', label: 'Número de Contrato', required: true },
    { name: 'fecha_inicial', label: 'Fecha Inicial', type: 'date' as const, required: true },
    { name: 'fecha_final', label: 'Fecha Final', type: 'date' as const, required: true },
    { name: 'valor', label: 'Valor', type: 'number' as const },
    { name: 'regimen', label: 'Régimen' },
    { name: 'activo', label: 'Activo', type: 'boolean' as const },
  ]

  const handleNew = () => {
    setEditId(null)
    setValues({ activo: true })
    setModal(true)
  }

  const handleEdit = (row: Record<string, unknown>) => {
    setEditId(row.id as string)
    setValues({ ...row })
    setModal(true)
  }

  const handleDelete = async (row: Record<string, unknown>) => {
    if (confirm('¿Eliminar este contrato?')) await remove(row.id as string)
  }

  const handleSave = async (vals: Record<string, unknown>) => {
    if (editId) await update(editId, vals)
    else await create(vals)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contratos</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nuevo Contrato"
        searchPlaceholder="Buscar contrato..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Contrato' : 'Nuevo Contrato'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
