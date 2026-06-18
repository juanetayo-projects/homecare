import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './stores/auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PacientesList from './pages/PacientesList'
import PacientesForm from './pages/PacientesForm'
import PlaceholderPage from './pages/PlaceholderPage'
import EntidadesPage from './pages/config/EntidadesPage'
import ContratosPage from './pages/config/ContratosPage'
import ServiciosPage from './pages/config/ServiciosPage'
import ArticulosPage from './pages/config/ArticulosPage'
import TablasPage from './pages/config/TablasPage'
import CalendarioPage from './pages/config/CalendarioPage'
import SedesPage from './pages/config/SedesPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const loading = useAuthStore((s) => s.loading)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initialize().then(() => setReady(true))
  }, [initialize])

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <BrowserRouter basename="/homecare">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<PacientesList />} />
          <Route path="/pacientes/nuevo" element={<PacientesForm />} />
          <Route path="/pacientes/:id" element={<PacientesForm />} />

          {['/historias/apertura', '/historias/apertura/nueva', '/historias/evolucion', '/historias/evol-control', '/historias/epicrisis'].map((p) => (
            <Route key={p} path={p} element={<PlaceholderPage title="Historia Clínica" description="Módulo en construcción" />} />
          ))}

          {['/historias/enfermeria', '/historias/nutricion', '/historias/gerontologia', '/historias/psicologia'].map((p) => (
            <Route key={p} path={p} element={<PlaceholderPage title="Historia Clínica" description="Módulo en construcción" />} />
          ))}

          {['/historias/terapias/respiratoria', '/historias/terapias/fisica', '/historias/terapias/ocupacional', '/historias/terapias/fonoaudiologia'].map((p) => (
            <Route key={p} path={p} element={<PlaceholderPage title="Terapia" description="Módulo en construcción" />} />
          ))}

          <Route path="/agenda" element={<PlaceholderPage title="Agenda de Citas" description="Calendario de citas" />} />
          <Route path="/programacion" element={<PlaceholderPage title="Programación de Servicios" description="Asignación de paquetes y servicios por paciente" />} />

          {['/informes/masivas', '/informes/asignacion-profesionales', '/informes/cuentas-cobro', '/informes/resumen-cuentas-cobro', '/informes/gestion-humana', '/informes/datos-pacientes', '/informes/derivados'].map((p) => (
            <Route key={p} path={p} element={<PlaceholderPage title="Informes" description="Módulo en construcción" />} />
          ))}

          <Route path="/datos/sedes" element={<SedesPage />} />
          <Route path="/datos/entidades" element={<EntidadesPage />} />
          <Route path="/datos/contratos" element={<ContratosPage />} />
          <Route path="/datos/paquetes" element={<ServiciosPage />} />
          <Route path="/datos/articulos" element={<ArticulosPage />} />
          <Route path="/datos/tablas" element={<TablasPage />} />
          <Route path="/datos/calendario" element={<CalendarioPage />} />
          <Route path="/datos/profesionales" element={<PlaceholderPage title="Profesionales" description="Módulo en construcción" />} />
          <Route path="/datos/usuarios" element={<PlaceholderPage title="Usuarios" description="Módulo en construcción" />} />

          {['/admin/actividades', '/admin/copiar-mes', '/admin/alimentar-nomina', '/admin/subir-firmas', '/admin/firmas-registradas', '/admin/documentos', '/admin/infografias'].map((p) => (
            <Route key={p} path={p} element={<PlaceholderPage title="Administración" description="Módulo en construcción" />} />
          ))}

          {['/admin/historias/auditoria', '/admin/historias/abrir-aperturas', '/admin/historias/abrir-evoluciones', '/admin/historias/abrir-evol-control', '/admin/historias/abrir-terapias', '/admin/historias/abrir-enfermeria', '/admin/historias/historias-clinicas', '/admin/historias/soportes-facturacion', '/admin/historias/historias-profesionales', '/admin/historias/historias-fecha'].map((p) => (
            <Route key={p} path={p} element={<PlaceholderPage title="Administración de Historias" description="Módulo en construcción" />} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
