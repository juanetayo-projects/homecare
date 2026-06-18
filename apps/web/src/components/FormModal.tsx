import { useEffect, useRef } from 'react'

interface Field {
  name: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean' | 'email'
  required?: boolean
  options?: { value: string; label: string }[]
}

interface FormModalProps {
  open: boolean
  onClose: () => void
  title: string
  children?: React.ReactNode
  fields?: Field[]
  values?: Record<string, unknown>
  onSave?: (vals: Record<string, unknown>) => void
  submitLabel?: string
  loading?: boolean
  width?: string
}

export default function FormModal({
  open,
  onClose,
  title,
  children,
  fields,
  values = {},
  onSave,
  submitLabel = 'Guardar',
  loading,
  width = 'max-w-lg',
}: FormModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current || !onSave) return
    const formData = new FormData(formRef.current)
    const vals: Record<string, unknown> = {}
    for (const [key, val] of formData.entries()) {
      vals[key] = val
    }
    if (fields) {
      for (const field of fields) {
        if (field.type === 'boolean' && !formData.has(field.name)) {
          vals[field.name] = false
        }
        if (field.type === 'number') {
          vals[field.name] = Number(vals[field.name])
        }
      }
    }
    onSave(vals)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        className={`relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full ${width} max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form ref={formRef} onSubmit={onSave ? handleSubmit : (e) => e.preventDefault()} className="overflow-y-auto p-6 space-y-4">
          {fields ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => {
                const val = values[field.name] ?? ''
                return (
                  <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'select' && field.options ? (
                      <select
                        name={field.name}
                        defaultValue={String(val)}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent bg-white transition"
                      >
                        <option value="">-- Seleccionar --</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'boolean' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          name={field.name}
                          defaultChecked={val === true || val === 'true'}
                          className="w-4 h-4 rounded border-gray-300 text-[#0D2D6B] focus:ring-[#0D2D6B]"
                        />
                        <span className="text-sm text-gray-500">Activo</span>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        defaultValue={String(val)}
                        required={field.required}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent transition resize-none"
                      />
                    ) : (
                      <input
                        type={field.type === 'email' ? 'email' : field.type || 'text'}
                        name={field.name}
                        defaultValue={String(val)}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D6B] focus:border-transparent transition"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            children
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-[#0D2D6B] hover:bg-[#16468E] rounded-lg transition disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </span>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
