export interface NavItem {
  label: string
  path?: string
  icon?: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    label: 'Inicio',
    path: '/',
    icon: 'home',
  },
  {
    label: 'Pacientes',
    path: '/pacientes',
    icon: 'users',
  },
  {
    label: 'Historia Clínica',
    icon: 'file-text',
    children: [
      { label: 'Valoración Clínica Inicial', path: '/historias/apertura' },
      { label: 'Apertura de Historia', path: '/historias/apertura/nueva' },
      { label: 'Evolución Médica', path: '/historias/evolucion' },
      { label: 'Control de Evolución', path: '/historias/evol-control' },
      { label: 'Epicrisis', path: '/historias/epicrisis' },
      { label: 'Notas de Enfermería', path: '/historias/enfermeria' },
      { label: 'Nutrición', path: '/historias/nutricion' },
      { label: 'Gerontología', path: '/historias/gerontologia' },
      { label: 'Psicología', path: '/historias/psicologia' },
      {
        label: 'Terapias',
        children: [
          { label: 'Terapia Respiratoria', path: '/historias/terapias/respiratoria' },
          { label: 'Terapia Física', path: '/historias/terapias/fisica' },
          { label: 'Terapia Ocupacional', path: '/historias/terapias/ocupacional' },
          { label: 'Fonoaudiología', path: '/historias/terapias/fonoaudiologia' },
        ],
      },
    ],
  },
  {
    label: 'Agenda',
    path: '/agenda',
    icon: 'calendar',
  },
  {
    label: 'Programación',
    path: '/programacion',
    icon: 'clipboard-list',
  },
  {
    label: 'Informes',
    icon: 'bar-chart',
    children: [
      { label: 'Cuadro de Masivas', path: '/informes/masivas' },
      { label: 'Asignación a Profesionales', path: '/informes/asignacion-profesionales' },
      { label: 'Cuentas de Cobro', path: '/informes/cuentas-cobro' },
      { label: 'Resumen Cuentas de Cobro', path: '/informes/resumen-cuentas-cobro' },
      { label: 'Gestión Humana', path: '/informes/gestion-humana' },
      { label: 'Datos de Pacientes', path: '/informes/datos-pacientes' },
      { label: 'Derivados', path: '/informes/derivados' },
    ],
  },
  {
    label: 'Datos',
    icon: 'database',
    children: [
      { label: 'Sedes', path: '/datos/sedes' },
      { label: 'Entidades (EPS)', path: '/datos/entidades' },
      { label: 'Contratos', path: '/datos/contratos' },
      { label: 'Paquetes de Servicios', path: '/datos/paquetes' },
      { label: 'Medicamentos/Insumos', path: '/datos/articulos' },
      { label: 'Tablas Paramétricas', path: '/datos/tablas' },
      { label: 'Calendario Anual', path: '/datos/calendario' },
      { label: 'Profesionales', path: '/datos/profesionales' },
      { label: 'Usuarios', path: '/datos/usuarios' },
    ],
  },
  {
    label: 'Administrador',
    icon: 'settings',
    children: [
      { label: 'Actividades y Cierre Cuentas', path: '/admin/actividades' },
      { label: 'Copiar de un Mes a Otro', path: '/admin/copiar-mes' },
      { label: 'Alimentar Datos a Nómina', path: '/admin/alimentar-nomina' },
      { label: 'Subir Firmas', path: '/admin/subir-firmas' },
      { label: 'Ver Firmas Registradas', path: '/admin/firmas-registradas' },
      { label: 'Subir Documentos', path: '/admin/documentos' },
      { label: 'Gestionar Infografías', path: '/admin/infografias' },
      {
        label: 'Historias',
        children: [
          { label: 'Auditoría de Historias', path: '/admin/historias/auditoria' },
          { label: 'Abrir Aperturas', path: '/admin/historias/abrir-aperturas' },
          { label: 'Abrir Evoluciones', path: '/admin/historias/abrir-evoluciones' },
          { label: 'Abrir Evoluciones de Control', path: '/admin/historias/abrir-evol-control' },
          { label: 'Abrir Terapias', path: '/admin/historias/abrir-terapias' },
          { label: 'Abrir Notas de Enfermería', path: '/admin/historias/abrir-enfermeria' },
          { label: 'Historias Clínicas', path: '/admin/historias/historias-clinicas' },
          { label: 'Soportes a Facturación', path: '/admin/historias/soportes-facturacion' },
          { label: 'Historias de Profesionales', path: '/admin/historias/historias-profesionales' },
          { label: 'Historias por Fecha', path: '/admin/historias/historias-fecha' },
        ],
      },
    ],
  },
]
