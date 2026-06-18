import { useState } from 'react'
import DataTable, { type Column } from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useCrud } from '../../lib/useCrud'

const columns: Column[] = [
  { key: 'codigo_cups', label: 'Código CUPS' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'nombre', label: 'Nombre' },
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

const fields = [
  { name: 'codigo_cups', label: 'Código CUPS', required: true },
  {
    name: 'tipo', label: 'Tipo', type: 'select' as const, required: true,
    options: [
      { value: 'consulta', label: 'Consulta' },
      { value: 'terapia', label: 'Terapia' },
      { value: 'procedimiento', label: 'Procedimiento' },
      { value: 'enfermeria', label: 'Enfermería' },
      { value: 'nutricion', label: 'Nutrición' },
      { value: 'psicologia', label: 'Psicología' },
      { value: 'otros', label: 'Otros' },
    ],
  },
  { name: 'nombre', label: 'Nombre del Servicio', required: true },
  { name: 'valor', label: 'Valor', type: 'number' as const },
  { name: 'valor_urbano_prof', label: 'Valor Urbano Profesional', type: 'number' as const },
  { name: 'valor_rural_prof', label: 'Valor Rural Profesional', type: 'number' as const },
  { name: 'cod_facturacion', label: 'Código Facturación' },
  { name: 'activo', label: 'Activo', type: 'boolean' as const },
]

export default function ServiciosPage() {
  const { data, loading, create, update, remove } = useCrud('servicios_catalogo', 'codigo_cups')
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
    if (confirm('¿Eliminar este servicio?')) await remove(row.id as string)
  }

  const handleSave = async (vals: Record<string, unknown>) => {
    if (editId) await update(editId, vals)
    else await create(vals)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paquetes de Servicios (CUPS)</h1>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        newLabel="+ Nuevo Servicio"
        searchPlaceholder="Buscar por CUPS o nombre..."
      />
      <FormModal
        open={modal}
        title={editId ? 'Editar Servicio' : 'Nuevo Servicio'}
        fields={fields}
        values={values}
        onClose={() => setModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}
