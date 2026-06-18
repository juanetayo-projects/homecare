import { useState } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'

const columns: Column[] = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'valor', label: 'Valor' },
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
  {
    name: 'tipo', label: 'Tipo', type: 'select' as const, required: true,
    options: [
      { value: 'tipo_identidad', label: 'Tipo Identidad' },
      { value: 'sexo', label: 'Sexo' },
      { value: 'estado_civil', label: 'Estado Civil' },
      { value: 'nivel_educativo', label: 'Nivel Educativo' },
      { value: 'etnia', label: 'Etnia' },
      { value: 'tipo_via', label: 'Tipo Vía' },
      { value: 'tipo_inmueble', label: 'Tipo Inmueble' },
      { value: 'parentesco', label: 'Parentesco' },
      { value: 'tipo_usuario', label: 'Tipo Usuario' },
      { value: 'regimen', label: 'Régimen' },
      { value: 'tipo_consulta', label: 'Tipo Consulta' },
      { value: 'medio_atencion', label: 'Medio Atención' },
      { value: 'otros', label: 'Otros' },
    ],
  },
  { name: 'codigo', label: 'Código' },
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'valor', label: 'Valor' },
  { name: 'activo', label: 'Activo', type: 'boolean' as const },
]

export default function TablasPage() {
  const { data, loading, create, update, remove } = useCrud('tablas_param', 'tipo')
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
    if (confirm('¿Eliminar este registro?')) await remove(row.id as string)
  }

  const handleSave = async (vals: Record<string, unknown>) => {
    if (editId) await update(editId, vals)
    else await create(vals)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tablas Paramétricas</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nuevo Registro"
        searchPlaceholder="Buscar parámetro..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Parámetro' : 'Nuevo Parámetro'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
