-- ============================================
-- HomeCare Soft - Pol�ticas RLS
-- Versi�n: 003
-- ============================================

-- Habilitar RLS en todas las tablas
alter table sedes enable row level security;
alter table roles enable row level security;
alter table permisos enable row level security;
alter table rol_permisos enable row level security;
alter table perfiles enable row level security;
alter table usuario_roles enable row level security;
alter table usuario_sedes enable row level security;
alter table entidades enable row level security;
alter table contratos enable row level security;
alter table pacientes enable row level security;
alter table paciente_diagnosticos enable row level security;
alter table paciente_cuidadores enable row level security;
alter table paciente_vivienda enable row level security;
alter table servicios_catalogo enable row level security;
alter table articulos enable row level security;
alter table tablas_param enable row level security;
alter table programacion_servicios enable row level security;
alter table programacion_items enable row level security;
alter table tipos_historia enable row level security;
alter table historias enable row level security;
alter table h_apertura enable row level security;
alter table h_evolucion enable row level security;
alter table h_evol_control enable row level security;
alter table h_epicrisis enable row level security;
alter table h_enfermeria enable row level security;
alter table h_nutricion enable row level security;
alter table h_gerontologia enable row level security;
alter table h_trabajo_social enable row level security;
alter table h_psicologia enable row level security;
alter table h_terapia enable row level security;
alter table citas enable row level security;
alter table firmas enable row level security;
alter table documentos enable row level security;
alter table infografias enable row level security;
alter table calendario_festivos enable row level security;
alter table audit_log enable row level security;

-- Pol�tica base: solo usuarios autenticados
create policy "Acceso solo usuarios autenticados"
  on sedes for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on roles for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on permisos for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on rol_permisos for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on tipos_historia for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on calendario_festivos for select
  using (auth.role() = 'authenticated');

-- Perfiles: cada uno ve su perfil
create policy "Usuarios ven su propio perfil"
  on perfiles for select
  using (id = auth.uid());

create policy "Usuarios actualizan su propio perfil"
  on perfiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Tablas con sede: acceso autenticado
create policy "Acceso autenticado"
  on pacientes for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on paciente_diagnosticos for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on paciente_cuidadores for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on paciente_vivienda for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on historias for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_apertura for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_evolucion for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_evol_control for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_epicrisis for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_enfermeria for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_nutricion for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_gerontologia for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_trabajo_social for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_psicologia for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on h_terapia for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on programacion_servicios for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on programacion_items for all
  using (auth.role() = 'authenticated');

create policy "Acceso autenticado"
  on citas for all
  using (auth.role() = 'authenticated');

-- Tablas maestras
create policy "Acceso solo usuarios autenticados"
  on entidades for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on contratos for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on servicios_catalogo for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on articulos for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on tablas_param for select
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on infografias for select
  using (auth.role() = 'authenticated');

-- Documentos y firmas
create policy "Acceso solo usuarios autenticados"
  on documentos for all
  using (auth.role() = 'authenticated');

create policy "Acceso solo usuarios autenticados"
  on firmas for all
  using (auth.role() = 'authenticated');

-- Auditor�a
create policy "Auditoria solo lectura"
  on audit_log for select
  using (auth.role() = 'authenticated');
