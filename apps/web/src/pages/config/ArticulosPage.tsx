import { useState } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'

const columns: Column[] = [
  { key: 'codigo', label: 'Código' },
  { key: 'codigo_cup', label: 'Código CUP' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'grupo', label: 'Grupo' },
  { key: 'linea', label: 'Línea' },
  { key: 'estado', label: 'Estado' },
]

const fields = [
  { name: 'codigo', label: 'Código', required: true },
  { name: 'codigo_cup', label: 'Código CUP' },
  { name: 'descripcion', label: 'Descripción' },
  { name: 'grupo', label: 'Grupo' },
  { name: 'linea', label: 'Línea' },
  {
    name: 'estado', label: 'Estado', type: 'select' as const,
    options: [
      { value: 'Activo', label: 'Activo' },
      { value: 'Inactivo', label: 'Inactivo' },
    ],
  },
]

export default function ArticulosPage() {
  const { data, loading, create, update, remove } = useCrud('articulos', 'codigo')
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})

  const handleNew = () => {
    setEditId(null)
    setValues({ estado: 'Activo' })
    setModal(true)
  }

  const handleEdit = (row: Record<string, unknown>) => {
    setEditId(row.id as string)
    setValues({ ...row })
    setModal(true)
  }

  const handleDelete = async (row: Record<string, unknown>) => {
    if (confirm('¿Eliminar este artículo?')) await remove(row.id as string)
  }

  const handleSave = async (vals: Record<string, unknown>) => {
    if (editId) await update(editId, vals)
    else await create(vals)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Medicamentos / Insumos</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nuevo Artículo"
        searchPlaceholder="Buscar artículo..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Artículo' : 'Nuevo Artículo'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
