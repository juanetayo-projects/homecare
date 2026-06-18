-- ============================================
-- HomeCare Soft - Esquema Inicial
-- Versión: 001
-- ============================================

-- Extensiones
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- ORGANIZACIÓN
-- ============================================

create table sedes (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar(20) not null unique,
  nombre varchar(255) not null,
  ciudad varchar(100) not null,
  direccion varchar(255),
  telefonos varchar(100),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default uuid_generate_v4(),
  nombre varchar(100) not null unique,
  descripcion text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table permisos (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar(50) not null unique,
  nombre varchar(255) not null,
  descripcion text,
  created_at timestamptz not null default now()
);

create table rol_permisos (
  rol_id uuid not null references roles(id) on delete cascade,
  permiso_id uuid not null references permisos(id) on delete cascade,
  primary key (rol_id, permiso_id)
);

-- ============================================
-- USUARIOS (Perfiles vinculados a auth.users)
-- ============================================

create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombres varchar(255) not null,
  apellidos varchar(255) not null,
  cedula varchar(20) not null unique,
  telefono varchar(20),
  registro_medico varchar(50),
  especialidad varchar(255),
  color_agenda varchar(20) default '#3788d8',
  activo boolean not null default true,
  sede_activa_id uuid references sedes(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table usuario_roles (
  usuario_id uuid not null references perfiles(id) on delete cascade,
  rol_id uuid not null references roles(id) on delete cascade,
  sede_id uuid references sedes(id),
  primary key (usuario_id, rol_id, sede_id)
);

create table usuario_sedes (
  usuario_id uuid not null references perfiles(id) on delete cascade,
  sede_id uuid not null references sedes(id) on delete cascade,
  primary key (usuario_id, sede_id)
);

-- ============================================
-- ENTIDADES (EPS / Pagadores)
-- ============================================

create table entidades (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar(20) not null unique,
  nit varchar(20) not null,
  nombre varchar(255) not null,
  unidad varchar(50),
  direccion varchar(255),
  ciudad varchar(100),
  telefono varchar(50),
  email varchar(255),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contratos (
  id uuid primary key default uuid_generate_v4(),
  entidad_id uuid not null references entidades(id) on delete cascade,
  numero varchar(50) not null,
  fecha_inicial date not null,
  fecha_final date not null,
  valor numeric(15, 2),
  regimen varchar(50),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- PACIENTES
-- ============================================

create table pacientes (
  id uuid primary key default uuid_generate_v4(),
  tipo_identidad varchar(10) not null default 'CC',
  identidad varchar(20) not null unique,
  apellidos varchar(255) not null,
  nombres varchar(255) not null,
  rh varchar(5),
  sexo varchar(1) not null,
  estado_civil varchar(50),
  fecha_nacimiento date not null,
  email varchar(255),
  direccion varchar(255),
  barrio varchar(100),
  telefono_fijo varchar(20),
  telefono_movil varchar(20),
  ciudad_atencion varchar(100),
  ciudad_visita varchar(100),
  tipo_via varchar(50),
  tipo_inmueble varchar(50),
  comuna varchar(50),
  religion varchar(100),
  nivel_educativo varchar(100),
  etnia varchar(100),
  responsable_nombre varchar(255),
  responsable_telefono varchar(20),
  tipo_paciente varchar(50),
  periodo_visitas varchar(50),
  fecha_ingreso date,
  tipo_usuario varchar(50) default 'Subsidiado',
  entidad_id uuid references entidades(id),
  aceptado boolean default false,
  estado varchar(50) not null default 'Activo',
  fecha_estado date,
  alto_riesgo boolean not null default false,
  medico_tratante varchar(255),
  sede_id uuid not null references sedes(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_pacientes_identidad on pacientes(identidad);
create index idx_pacientes_sede on pacientes(sede_id);
create index idx_pacientes_estado on pacientes(estado);
create index idx_pacientes_entidad on pacientes(entidad_id);

create table paciente_diagnosticos (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  codigo_cie10 varchar(10) not null,
  descripcion text,
  tipo varchar(50) default 'Principal',
  riesgo_hemodinamico boolean default false,
  riesgo_vital boolean default false,
  created_at timestamptz not null default now()
);

create index idx_pac_diag_paciente on paciente_diagnosticos(paciente_id);

create table paciente_cuidadores (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  nombre varchar(255) not null,
  parentesco varchar(100),
  telefono varchar(20),
  estado_civil varchar(50),
  created_at timestamptz not null default now()
);

create table paciente_vivienda (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade unique,
  tipo_vivienda varchar(50),
  estrato integer,
  pisos integer,
  habitaciones integer,
  banos integer,
  cocina varchar(50),
  servicios_publicos text[],
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- CATÁLOGOS DE SERVICIOS Y ARTÍCULOS
-- ============================================

create table servicios_catalogo (
  id uuid primary key default uuid_generate_v4(),
  codigo_cups varchar(20) not null unique,
  tipo varchar(50) not null,
  nombre varchar(500) not null,
  valor numeric(15, 2) default 0,
  valor_urbano_prof numeric(15, 2),
  valor_rural_prof numeric(15, 2),
  cod_facturacion varchar(50),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_servicios_cups on servicios_catalogo(codigo_cups);
create index idx_servicios_tipo on servicios_catalogo(tipo);

create table articulos (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar(50) not null unique,
  codigo_cup varchar(20),
  descripcion varchar(500),
  grupo varchar(100),
  linea varchar(100),
  estado varchar(20) default 'Activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tablas_param (
  id uuid primary key default uuid_generate_v4(),
  tipo varchar(50) not null,
  codigo varchar(50),
  nombre varchar(255) not null,
  valor text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_tablas_param_tipo on tablas_param(tipo);

-- ============================================
-- PROGRAMACIÓN DE SERVICIOS / FACTURACIÓN
-- ============================================

create table programacion_servicios (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  periodo_mes integer not null,
  periodo_anio integer not null,
  servicio_id uuid not null references servicios_catalogo(id),
  cantidad integer not null default 1,
  tarifa numeric(15, 2),
  numero_autorizacion varchar(100),
  fecha_autorizacion date,
  fecha_vencimiento date,
  periodicidad varchar(50) default 'Mensual',
  sede_id uuid not null references sedes(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_prog_serv_paciente on programacion_servicios(paciente_id);
create index idx_prog_serv_periodo on programacion_servicios(periodo_mes, periodo_anio);

create table programacion_items (
  id uuid primary key default uuid_generate_v4(),
  programacion_id uuid not null references programacion_servicios(id) on delete cascade,
  articulo_id uuid references articulos(id),
  descripcion varchar(500),
  cantidad integer not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================
-- HISTORIAS CLÍNICAS (Tablas tipadas por disciplina)
-- ============================================

create table tipos_historia (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar(30) not null unique,
  nombre varchar(255) not null,
  tiene_apertura boolean default true,
  tiene_evolucion boolean default true,
  activo boolean not null default true
);

insert into tipos_historia (codigo, nombre, tiene_apertura, tiene_evolucion) values
  ('APERTURA', 'Valoración Clínica Inicial / Apertura', true, false),
  ('EVOLUCION', 'Evolución Médica', false, true),
  ('EVOL_CONTROL', 'Control de Evolución', false, true),
  ('EPICRISIS', 'Epicrisis', false, false),
  ('ENFERMERIA', 'Notas de Enfermería', true, true),
  ('NUTRICION', 'Nutrición', true, true),
  ('GERONTOLOGIA', 'Gerontología', true, true),
  ('TRABAJO_SOCIAL', 'Trabajo Social / Test', true, true),
  ('PSICOLOGIA', 'Psicología', true, true),
  ('TERAPIA_FISICA', 'Terapia Física', true, true),
  ('TERAPIA_OCUPACIONAL', 'Terapia Ocupacional', true, true),
  ('TERAPIA_RESPIRATORIA', 'Terapia Respiratoria', true, true),
  ('TERAPIA_FONO', 'Fonoaudiología', true, true);

-- Cabecera común de historias
create table historias (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete restrict,
  tipo_historia_id uuid not null references tipos_historia(id),
  profesional_id uuid not null references perfiles(id),
  sede_id uuid not null references sedes(id),
  fecha_atencion timestamptz not null default now(),
  periodo_mes integer not null,
  periodo_anio integer not null,
  tipo_consulta varchar(100),
  medio varchar(50),
  estado varchar(50) not null default 'Borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_historias_paciente on historias(paciente_id);
create index idx_historias_profesional on historias(profesional_id);
create index idx_historias_periodo on historias(periodo_mes, periodo_anio);
create index idx_historias_tipo on historias(tipo_historia_id);

-- Tablas tipadas por disciplina

create table h_apertura (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  motivo_consulta text,
  enfermedad_actual text,
  ayudas_diagnosticas text,
  revision_sistemas jsonb,
  antecedentes text,
  examen_fisico jsonb,
  analisis text,
  plan_manejo text,
  recomendaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_evolucion (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  subjetivo text,
  objetivo jsonb,
  analisis text,
  plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_evol_control (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  subjetivo text,
  objetivo jsonb,
  analisis text,
  plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_epicrisis (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  resumen_ingreso text,
  hallazgos_relevantes text,
  procedimientos_realizados text,
  evolucion text,
  recomendaciones text,
  destino_paciente varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_enfermeria (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  valoracion text,
  diagnostico_enfermero text,
  intervenciones text,
  evolucion text,
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_nutricion (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  valoracion_nutricional jsonb,
  diagnostico text,
  plan_nutricional text,
  recomendaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_gerontologia (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  valoracion_geriatrica jsonb,
  diagnostico text,
  plan_cuidado text,
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_trabajo_social (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  evaluacion_social jsonb,
  diagnostico_social text,
  intervencion text,
  seguimiento text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_psicologia (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  evaluacion text,
  pruebas_aplicadas text,
  diagnostico text,
  plan_terapeutico text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table h_terapia (
  id uuid primary key default uuid_generate_v4(),
  historia_id uuid not null references historias(id) on delete cascade unique,
  disciplina varchar(50) not null,
  fase varchar(20) not null,
  valoracion text,
  objetivo text,
  tratamiento text,
  evolucion text,
  recomendaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- AGENDA DE CITAS
-- ============================================

create table citas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete restrict,
  profesional_id uuid not null references perfiles(id),
  sede_id uuid not null references sedes(id),
  fecha_inicio timestamptz not null,
  fecha_fin timestamptz not null,
  tipo_consulta varchar(100),
  estado varchar(50) not null default 'Programada',
  color varchar(20),
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_citas_profesional on citas(profesional_id);
create index idx_citas_fecha on citas(fecha_inicio);

-- ============================================
-- DOCUMENTOS Y FIRMAS
-- ============================================

create table firmas (
  id uuid primary key default uuid_generate_v4(),
  profesional_id uuid not null references perfiles(id) on delete cascade,
  imagen_url text not null,
  created_at timestamptz not null default now()
);

create table documentos (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references pacientes(id) on delete cascade,
  entidad_id uuid references entidades(id) on delete cascade,
  tipo varchar(50) not null,
  nombre varchar(255) not null,
  archivo_url text not null,
  created_at timestamptz not null default now()
);

create table infografias (
  id uuid primary key default uuid_generate_v4(),
  titulo varchar(255) not null,
  descripcion text,
  archivo_url text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table calendario_festivos (
  id uuid primary key default uuid_generate_v4(),
  fecha date not null,
  descripcion varchar(255),
  anio integer not null,
  unique(fecha)
);

-- ============================================
-- AUDITORÍA
-- ============================================

create table audit_log (
  id bigserial primary key,
  usuario_id uuid references perfiles(id),
  accion varchar(50) not null,
  entidad varchar(100) not null,
  registro_id uuid,
  datos_antes jsonb,
  datos_despues jsonb,
  ip_address inet,
  user_agent text,
  sede_id uuid references sedes(id),
  created_at timestamptz not null default now()
);

create index idx_audit_entidad on audit_log(entidad, registro_id);
create index idx_audit_usuario on audit_log(usuario_id);
create index idx_audit_fecha on audit_log(created_at);

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================

create or replace function trigger_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
