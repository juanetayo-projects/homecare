import { useState } from 'react'

export interface Column {
  key: string
  label: string
  render?: (row: Record<string, unknown>) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  loading?: boolean
  onEdit?: (row: Record<string, unknown>) => void
  onDelete?: (row: Record<string, unknown>) => void
  onNew?: () => void
  newLabel?: string
  searchPlaceholder?: string
}

export default function DataTable({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  onNew,
  newLabel = '+ Nuevo',
  searchPlaceholder = 'Buscar...',
}: DataTableProps) {
  const [search, setSearch] = useState('')

  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = row[col.key]
      return val != null && String(val).toLowerCase().includes(search.toLowerCase())
    })
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm max-w-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {onNew && (
          <button
            onClick={onNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition shrink-0"
          >
            {newLabel}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-medium text-gray-600">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Acción</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                    No hay registros
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={(row.id as string) || i} className="border-b border-gray-100 hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-gray-900">
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
