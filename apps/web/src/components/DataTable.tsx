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
        <div className="relative max-w-xs w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent bg-white transition"
          />
        </div>
        {onNew && (
          <button
            onClick={onNew}
            className="bg-[#0D2D6B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#16468E] transition shadow-sm shrink-0"
          >
            {newLabel}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acción</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-12 text-center text-gray-400">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm">No hay registros</p>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={(row.id as string) || i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-gray-700">
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition">
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition">
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
