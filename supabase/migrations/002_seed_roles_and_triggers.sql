-- ============================================
-- HomeCare Soft - Seed Roles, Permisos y Triggers
-- Versión: 002
-- ============================================

-- Roles
insert into roles (nombre, descripcion) values
  ('Administrador', 'Acceso completo a configuraci�n, usuarios, maestros, todas las sedes'),
  ('Coordinador', 'Gesti�n operativa de sus sedes asignadas'),
  ('Medico', 'Apertura, Evoluci�n, Control de Evoluci�n, Epicrisis de pacientes asignados'),
  ('Terapeuta', 'Historias cl�nicas de terapia (F�sica, Ocupacional, Respiratoria, Fono)'),
  ('Enfermeria', 'Notas de enfermer�a y valoraci�n'),
  ('Nutricionista', 'Historias de nutrici�n'),
  ('Gerontologo', 'Historias de gerontolog�a'),
  ('Psicologo', 'Historias de psicolog�a'),
  ('TrabajoSocial', 'Historias de trabajo social / test'),
  ('Admisiones', 'Gesti�n de pacientes, programaci�n de servicios, autorizaciones'),
  ('Facturacion', 'Reportes, cuentas de cobro, soportes a facturaci�n'),
  ('Nomina', 'Reportes de profesionales, alimentaci�n a n�mina'),
  ('Auditor', 'Solo lectura: visor de historias y bit�cora de auditor�a');

-- Permisos
insert into permisos (codigo, nombre, descripcion) values
  ('PACIENTES_VER', 'Ver pacientes', 'Consultar listado y ficha de pacientes'),
  ('PACIENTES_CREAR', 'Crear pacientes', 'Dar de alta nuevos pacientes'),
  ('PACIENTES_EDITAR', 'Editar pacientes', 'Modificar datos de pacientes'),
  ('HISTORIAS_VER', 'Ver historias', 'Consultar historias cl�nicas'),
  ('HISTORIAS_CREAR', 'Crear historias', 'Crear aperturas/evoluciones'),
  ('HISTORIAS_EDITAR', 'Editar historias', 'Modificar historias existentes'),
  ('HISTORIAS_ANULAR', 'Anular historias', 'Anular historias cl�nicas'),
  ('PROGRAMACION_VER', 'Ver programaci�n', 'Consultar programaci�n de servicios'),
  ('PROGRAMACION_CREAR', 'Crear programaci�n', 'Asignar servicios a pacientes'),
  ('PROGRAMACION_EDITAR', 'Editar programaci�n', 'Modificar programaci�n de servicios'),
  ('FACTURACION_VER', 'Ver facturaci�n', 'Consultar reportes de facturaci�n'),
  ('FACTURACION_EXPORTAR', 'Exportar facturaci�n', 'Exportar reportes a Excel'),
  ('AGENDA_VER', 'Ver agenda', 'Consultar agenda de citas'),
  ('AGENDA_CREAR', 'Crear citas', 'Programar citas en la agenda'),
  ('AGENDA_EDITAR', 'Editar citas', 'Modificar citas existentes'),
  ('USUARIOS_ADMIN', 'Administrar usuarios', 'Gestionar usuarios, roles y permisos'),
  ('MAESTROS_ADMIN', 'Administrar maestros', 'Gestionar cat�logos y tablas param�tricas'),
  ('CONFIG_ADMIN', 'Configuraci�n del sistema', 'Configuraci�n general del sistema'),
  ('AUDITORIA_VER', 'Ver auditor�a', 'Consultar bit�cora de auditor�a'),
  ('REPORTES_VER', 'Ver reportes', 'Consultar reportes operativos'),
  ('REPORTES_EXPORTAR', 'Exportar reportes', 'Exportar reportes a Excel/PDF'),
  ('DOCUMENTOS_VER', 'Ver documentos', 'Consultar documentos y firmas'),
  ('DOCUMENTOS_SUBIR', 'Subir documentos', 'Subir documentos y firmas');

-- Asignar permisos a roles (Administrador = todos)
insert into rol_permisos (rol_id, permiso_id)
select r.id, p.id from roles r, permisos p where r.nombre = 'Administrador';

-- Triggers updated_at
create or replace function trigger_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'sedes', 'perfiles', 'entidades', 'contratos', 'pacientes',
      'paciente_vivienda', 'servicios_catalogo', 'articulos',
      'programacion_servicios', 'historias', 'h_apertura', 'h_evolucion',
      'h_evol_control', 'h_epicrisis', 'h_enfermeria', 'h_nutricion',
      'h_gerontologia', 'h_trabajo_social', 'h_psicologia', 'h_terapia',
      'citas'
    ])
  loop
    execute format(
      'create trigger trigger_%s_updated_at before update on %s for each row execute function trigger_updated_at()',
      tbl, tbl
    );
  end loop;
end;
$$;
