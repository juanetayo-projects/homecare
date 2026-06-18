import { useState } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'

const columns: Column[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'telefonos', label: 'Teléfonos' },
  {
    key: 'activo',
    label: 'Estado',
    render: (r) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${r.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {r.activo ? 'Activa' : 'Inactiva'}
      </span>
    ),
  },
]

const fields = [
  { name: 'codigo', label: 'Código', required: true },
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'ciudad', label: 'Ciudad', required: true },
  { name: 'direccion', label: 'Dirección' },
  { name: 'telefonos', label: 'Teléfonos' },
  { name: 'activo', label: 'Activa', type: 'boolean' as const },
]

export default function SedesPage() {
  const { data, loading, create, update, remove } = useCrud('sedes', 'nombre')
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
    if (confirm('¿Eliminar esta sede?')) {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sedes</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nueva Sede"
        searchPlaceholder="Buscar sede..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Sede' : 'Nueva Sede'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
