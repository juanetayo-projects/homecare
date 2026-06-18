import { useState } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'

const columns: Column[] = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'anio', label: 'Año' },
]

const fields = [
  { name: 'fecha', label: 'Fecha', type: 'date' as const, required: true },
  { name: 'descripcion', label: 'Descripción' },
  { name: 'anio', label: 'Año', type: 'number' as const, required: true },
]

export default function CalendarioPage() {
  const { data, loading, create, update, remove } = useCrud('calendario_festivos', 'fecha')
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})

  const handleNew = () => {
    setEditId(null)
    setValues({ anio: new Date().getFullYear() })
    setModal(true)
  }

  const handleEdit = (row: Record<string, unknown>) => {
    setEditId(row.id as string)
    setValues({ ...row })
    setModal(true)
  }

  const handleDelete = async (row: Record<string, unknown>) => {
    if (confirm('¿Eliminar este festivo?')) await remove(row.id as string)
  }

  const handleSave = async (vals: Record<string, unknown>) => {
    if (editId) await update(editId, vals)
    else await create(vals)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendario Anual (Festivos)</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nuevo Festivo"
        searchPlaceholder="Buscar festivo..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Festivo' : 'Nuevo Festivo'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
