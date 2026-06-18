import { Link } from 'react-router-dom'

export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-400 mb-4">Módulo en construcción</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
