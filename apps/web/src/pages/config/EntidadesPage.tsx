import { useState } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'

const columns: Column[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'nit', label: 'NIT' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'unidad', label: 'Unidad' },
  { key: 'ciudad', label: 'Ciudad' },
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

const fields = [
  { name: 'codigo', label: 'Código', required: true },
  { name: 'nit', label: 'NIT', type: 'text' as const, required: true },
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'unidad', label: 'Unidad' },
  { name: 'direccion', label: 'Dirección' },
  { name: 'ciudad', label: 'Ciudad' },
  { name: 'telefono', label: 'Teléfono' },
  { name: 'email', label: 'Email', type: 'email' as const },
  { name: 'activo', label: 'Activo', type: 'boolean' as const },
]

export default function EntidadesPage() {
  const { data, loading, create, update, remove } = useCrud('entidades')
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})

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
    if (confirm('¿Eliminar esta entidad?')) {
      await remove(row.id as string)
    }
  }

  const handleSave = async (vals: Record<string, unknown>) => {
    if (editId) {
      await update(editId, vals)
    } else {
      await create(vals)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Entidades (EPS)</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nueva Entidad"
        searchPlaceholder="Buscar entidad..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Entidad' : 'Nueva Entidad'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
