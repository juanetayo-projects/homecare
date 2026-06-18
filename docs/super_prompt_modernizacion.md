# SUPER PROMPT — Modernización de la aplicación HOME CARE (TodoMed SAS)

> **Propósito de este documento:** servir como especificación maestra ("super prompt") para reconstruir, con tecnología moderna, la aplicación de gestión clínica domiciliaria hoy publicada en `https://si2t.co/adtweb/` (Yii2 + Bootstrap 3 + jQuery).
> **Basado en:** [analisis_ingenieria_inversa.md](analisis_ingenieria_inversa.md) (ingeniería inversa de la app legada).
> **Estado:** BORRADOR para revisión del propietario (Juan Carlos Etayo). Los puntos marcados con ❓ requieren tu decisión antes de iniciar.
> **Regla de seguridad:** este documento NO contiene contraseñas ni tokens. Los secretos se inyectan en tiempo de construcción (GitHub Secrets / variables de entorno de Supabase / `.env` local no versionado).

---

## 0. Cómo usar este super prompt
Este documento se entrega a un agente de desarrollo (Claude Code) o a un desarrollador como contexto único y completo. Define **qué construir, con qué stack, bajo qué reglas de seguridad y en qué orden**. Léelo de principio a fin antes de generar código. Cualquier ambigüedad se resuelve con el propietario, no con suposiciones.

---

## 1. Rol y objetivo

**Rol:** Eres un ingeniero full-stack senior especializado en aplicaciones clínicas (eHealth) para el sistema de salud colombiano, con dominio de React, Supabase (PostgreSQL/Auth/RLS/Storage/Edge Functions) y buenas prácticas de seguridad de datos sensibles (PHI).

**Objetivo:** Reconstruir la aplicación HOME CARE como una **SPA moderna, segura, multi-sede y responsive**, preservando la funcionalidad clínica y de facturación de la app legada, pero **corrigiendo sus fallas críticas de seguridad** (en especial el almacenamiento de contraseñas en texto plano) y modernizando la arquitectura y la experiencia de usuario.

**No-objetivos (en la versión inicial):** clonar pixel a pixel la UI legada; replicar el patrón de "abrir en pestañas nuevas"; mantener Bootstrap 3.

---

## 2. Contexto de la aplicación legada (resumen)

Sistema de **historia clínica electrónica para atención domiciliaria (Home Care)** de **TodoMed SAS**, multi-sede (ADT Cali, Palmira, Tuluá, Popayán, Buenaventura; además unidades VIH, Salud Mental). Volumen actual: ~**2.620 pacientes**, ~**931 usuarios**, catálogos de **5.656 servicios/CUPS** y **2.332 medicamentos/insumos**.

**Capacidades clave a preservar:**
- Gestión de **pacientes** (datos demográficos, sociales, vivienda, diagnósticos CIE-10, cuidadores, médico tratante, estado de atención).
- **Historia clínica por disciplina:** Valoración/Apertura, Evolución Médica, Control de Evolución, Epicrisis, Enfermería, Nutrición, Gerontología, Trabajo/Test Social, Psicología, y Terapias (Física, Ocupacional, Respiratoria, Fonoaudiología) cada una con Apertura + Evolución.
- **Programación de servicios / facturación:** asignación de paquetes/servicios con **CUPS**, **autorizaciones de EPS** (número, fechas, vencimiento), tarifas urbano/rural, insumos/medicamentos; trabajo por **periodo (Mes/Año)**.
- **Agenda de citas** (calendario por médico/consulta).
- **Reportes:** cuentas de cobro a profesionales, soportes a facturación (médicos/terapias/notas), masivas por EPS+CIE-10, gestión humana, alimentación a nómina.
- **Maestros:** entidades (EPS), contratos, paquetes/servicios, medicamentos/insumos, tablas paramétricas, calendario anual/festivos.
- **Documentos:** firmas digitalizadas, documentos y soportes, infografías.

**Fallas críticas a corregir (de la ingeniería inversa):**
1. 🔴 **Contraseñas en texto plano** (campo `type=text` que muestra la clave real) → reemplazar por autenticación con hashing irrecuperable (Supabase Auth).
2. 🟠 Sin **auditoría de accesos** a historia clínica.
3. 🟠 **Permisos por bandera, usuario por usuario** (no RBAC con roles reutilizables).
4. 🟠 Exposición de IP del servidor; cuentas inactivas masivas; correos placeholder.
5. 🟡 Bootstrap 3 (EOL), formularios monolíticos, sin responsive, periodo por defecto desactualizado, calidad de datos deficiente en catálogos.

---

## 3. Stack tecnológico objetivo

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | **React 18 + Vite + TypeScript** | SPA. Enrutado con React Router. |
| UI | ❓ **A elegir:** Tailwind CSS + shadcn/ui (recomendado) | Design system moderno, accesible y responsive. |
| Estado/datos | **TanStack Query** (server state) + Zustand/Context para UI | Cache, revalidación, optimistic updates. |
| Backend / BaaS | **Supabase** | PostgreSQL + Auth + Row Level Security + Storage + Edge Functions (Deno). |
| Autenticación | **Supabase Auth** | Email/clave con hash; MFA para roles administrativos; recuperación por correo. |
| Correo transaccional | **Resend** (dominio `cacsantabarbara.co` validado) | Invitaciones, restablecimiento, notificaciones, envío de soportes. |
| Tablas/grillas | **TanStack Table** | Unificar (eliminar la mezcla Tabulator/GridView legada). |
| Calendario | **FullCalendar** (o react-big-calendar) | Para la agenda. |
| Reportes/PDF | ❓ react-pdf / pdfmake (cliente) o Edge Function (servidor) | Cuentas de cobro, soportes, epicrisis imprimibles. |
| Export Excel | SheetJS (xlsx) | Preservar exportaciones existentes. |
| Repos/CI-CD | **GitHub** + **GitHub Actions** | Lint, test, build, migraciones Supabase, deploy. |
| Hosting frontend | ❓ **GitHub Pages** (como tus otros proyectos) o Vercel/Netlify | Pages sirve estático; ver §9 sobre consideraciones de PHI. |

> ❓ **Decisión 1 (hosting):** GitHub Pages es estático y público por URL (el control de acceso lo da Supabase Auth + RLS, no el hosting). Para una app con datos clínicos, evaluar si Pages es suficiente o si conviene Vercel/Netlify (variables de entorno server-side, headers de seguridad, dominio propio bajo `cacsantabarbara.co`).

---

## 4. Principios y requisitos no funcionales

1. **Seguridad primero (security by design).** Ninguna credencial en texto plano jamás. Toda tabla con PHI protegida por **RLS**. Secretos solo en variables de entorno / GitHub Secrets / Supabase Vault.
2. **Multi-sede (multi-tenant lógico).** Cada usuario pertenece a una o varias sedes; los datos se filtran por sede vía RLS. Cambio de sede en sesión (como hoy "Cambiar Sede").
3. **RBAC real.** Roles reutilizables (ver §6) con permisos por módulo/acción; la sede es una dimensión de alcance, no un permiso.
4. **Auditoría.** Bitácora inmutable de accesos y cambios sobre historia clínica y datos sensibles (quién, qué, cuándo, desde dónde).
5. **Cumplimiento normativo (Colombia):** Ley 1581/2012 (Habeas Data) y Decreto 1377/2013; Resolución 1995/1999 (historia clínica); Resolución 866/2021 (interoperabilidad HCE); RIPS y Facturación Electrónica de Venta (FEV/DIAN) como capacidades futuras.
6. **Responsive y accesible.** Uso en escritorio y **tablet/móvil en campo**; WCAG AA; idioma **es-CO**.
7. **Calidad de datos.** Catálogos controlados, campos obligatorios, validaciones en formulario y a nivel de BD (constraints).
8. **Rendimiento.** Paginación/virtualización en listados grandes (pacientes, catálogos). Índices adecuados.
9. **Trazabilidad de versión.** Versionado semántico; migraciones de BD versionadas (Supabase migrations).
10. **Internacionalización de fechas/moneda** a formato colombiano; periodos contables Mes/Año.

---

## 5. Modelo de datos (propuesta inicial)

> Derivado de la ingeniería inversa. A refinar con el propietario y con una eventual extracción del esquema legado. Nombres en `snake_case`, en español o inglés consistente (❓ Decisión 2).

**Núcleo organizacional**
- `sedes` (id, codigo, nombre, ciudad, direccion, telefonos, activo)
- `usuarios` → gestionados por **Supabase Auth** (`auth.users`) + tabla perfil `perfiles` (id=auth uid, nombres, apellidos, cedula, registro_medico, especialidad, color_agenda, activo)
- `roles` (id, nombre) y `permisos` (id, modulo, accion); `rol_permisos`; `usuario_roles` (usuario, rol, sede)
- `usuario_sedes` (usuario, sede) — alcance multi-sede

**Pacientes y clínica**
- `pacientes` (identificación, demografía, contacto, ubicación, social, entidad/EPS, tipo_usuario, estado, alto_riesgo, fechas…)
- `paciente_diagnosticos` (paciente, cie10, tipo_dx principal/relacionado, flags de riesgo)
- `paciente_cuidadores` (nombre, parentesco, telefono, estado_civil)
- `paciente_vivienda`, `paciente_otros_datos`
- `historias` (cabecera común: paciente, tipo_historia, profesional, fecha, sede, estado, periodo) + tablas/JSONB por tipo:
  - `h_apertura`, `h_evolucion`, `h_evol_control`, `h_epicrisis`, `h_enfermeria`, `h_nutricion`, `h_gerontologia`, `h_trabajo_social`, `h_psicologia`, `h_terapia` (con `disciplina`: fisica/ocupacional/respiratoria/fono y `fase`: apertura/evolucion)
  - ❓ **Decisión 3:** modelar cada tipo como tabla propia (tipado fuerte) vs. una tabla `historias` con secciones en **JSONB** (flexible). Recomendado: cabecera tipada + sección clínica en JSONB validado por esquema.

**Facturación / operación**
- `entidades` (EPS/pagadores: codigo, nit, unidad, nombre, contacto, activo)
- `contratos` (entidad, numero, fecha_inicial, fecha_final, valor, regimen, activo)
- `servicios_catalogo` (cups, tipo: paquete/servicio/insumo, nombre, valor, valor_urbano_prof, valor_rural_prof, cod_facturacion)
- `articulos` (medicamentos/insumos: codigo, codigo_cup, descripcion, grupo, linea, estado)
- `tablas_param` (catálogos paramétricos; reemplazar la tabla genérica por catálogos tipados donde sea posible)
- `programacion_servicios` (paciente, periodo, cups, cantidad, tarifa, num_autorizacion, fec_autoriz, fec_vencimiento, periodicidad)
- `programacion_items` (insumos/medicamentos adicionales por programación)

**Agenda y documentos**
- `citas` (paciente, profesional, sede, fecha_inicio, fecha_fin, tipo_consulta, estado, color)
- `firmas` (profesional, imagen en Storage)
- `documentos` (paciente/entidad, tipo, archivo en Storage)
- `infografias`, `calendario_festivos`

**Auditoría**
- `audit_log` (usuario, accion, entidad, registro_id, datos_antes, datos_despues, ip, user_agent, timestamp) — poblado por **triggers** y por la app en lecturas sensibles.

---

## 6. Roles propuestos (RBAC)

| Rol | Alcance típico |
|---|---|
| **Administrador** | Configuración, usuarios/roles, maestros, todas las sedes. |
| **Coordinador de sede** | Gestión operativa de su(s) sede(s). |
| **Médico** | Apertura/Evolución/Control/Epicrisis de sus pacientes asignados. |
| **Terapeuta** (física/ocupacional/respiratoria/fono) | Historias de terapia de su disciplina. |
| **Enfermería** | Notas de enfermería, valoración. |
| **Nutricionista / Gerontólogo / Psicólogo / Trab. Social** | Su tipo de historia. |
| **Admisiones / Facturación** | Pacientes, programación de servicios, autorizaciones, reportes, cuentas de cobro. |
| **Nómina / Gestión Humana** | Reportes de profesionales, alimentación a nómina. |
| **Auditor (solo lectura)** | Visor de historias y bitácora de auditoría, sin edición. |

> Cada permiso = (módulo, acción: ver/crear/editar/anular/exportar). Mapear los checkboxes legados (Médico/Terapeuta/Nómina/Admisiones/Medic-Insum/Administrador) a este modelo.

---

## 7. Seguridad detallada (obligatorio)

- **Auth:** Supabase Auth (email + clave). Alta de usuarios por invitación (Resend). **Restablecimiento** por correo. **MFA/2FA** obligatorio para Administrador y Facturación.
- **Contraseñas:** nunca se almacenan ni se muestran; hashing gestionado por Supabase (bcrypt/scrypt). Política de complejidad y expiración configurable.
- **RLS en todas las tablas con PHI:** políticas por `sede` y por `rol`; un profesional solo ve los pacientes/historias de su(s) sede(s) y alcance.
- **Auditoría inmutable:** triggers `AFTER INSERT/UPDATE/DELETE` sobre tablas clínicas → `audit_log`; registro de **accesos de lectura** a historia clínica desde la app/Edge Function. `audit_log` sin permisos de update/delete para nadie.
- **Storage:** documentos y firmas en buckets privados con políticas de acceso por sede/rol; URLs firmadas de corta vida.
- **Cabeceras y transporte:** HTTPS forzado, HSTS, CSP, X-Frame-Options/Frame-Ancestors, cookies `HttpOnly/Secure/SameSite` (según hosting elegido).
- **Secretos:** `SUPABASE_SERVICE_ROLE_KEY`, claves de Resend, etc. solo en GitHub Secrets / entorno de Edge Functions. El frontend usa únicamente la **anon key** + RLS.
- **Cumplimiento:** consentimiento informado/Habeas Data; política de retención y backups cifrados; minimización de datos en URLs (no PHI en query strings).

---

## 8. Migración de datos

1. **Extracción:** desde la app legada (export a Excel disponible en varios módulos) y/o acceso directo a la BD legada (❓ Decisión 4: ¿hay acceso a la base/servidor `190.108.78.182` o solo a la UI?).
2. **Mapeo:** legado → modelo nuevo (pacientes, historias, catálogos, programación, usuarios).
3. **Carga:** scripts ETL idempotentes (Node/SQL) con validación y reporte de rechazos; normalización de catálogos (CUPS, CIE-10, medicamentos) y limpieza (descripciones vacías, ciudades "(no definido)", correos placeholder).
4. **Usuarios:** se recrean en Supabase Auth con **clave temporal + restablecimiento forzado** (no se migra ninguna clave del sistema legado).
5. **Verificación:** conteos y muestreos contra el legado (2.620 pacientes, etc.).

---

## 9. Arquitectura y despliegue

- **Monorepo** en GitHub: `apps/web` (React) + `supabase/` (migraciones, políticas RLS, Edge Functions) + `scripts/` (ETL).
- **Supabase:** proyecto dedicado; migraciones versionadas (`supabase db push`); semillas de catálogos y roles.
- **CI/CD (GitHub Actions):** en PR → lint + typecheck + test + build; en `main` → aplicar migraciones a Supabase y **deploy** del frontend.
- **Entornos:** `dev` (Supabase de desarrollo) y `prod`. `.env.example` documentado; nada de `.env` versionado.
- ❓ **Hosting:** si GitHub Pages → SPA con base path y fallback 404→index; si Vercel/Netlify → dominio bajo `cacsantabarbara.co` y headers de seguridad. (Ver Decisión 1.)

---

## 10. Roadmap por fases

- **Fase 0 — Cimientos y seguridad:** repos, CI/CD, Supabase, Auth + RBAC + RLS base, esquema de auditoría, layout/responsive, login/cambio de sede.
- **Fase 1 — Maestros y pacientes:** entidades, contratos, catálogos (servicios/CUPS, medicamentos, paramétricas), módulo de **Pacientes** (listado + ficha en wizard).
- **Fase 2 — Historia clínica:** Apertura/Evolución médica, Enfermería y demás disciplinas; visor consolidado por paciente; impresión/epicrisis.
- **Fase 3 — Programación y facturación:** programación de servicios, autorizaciones, soportes a facturación, cuentas de cobro, masivas.
- **Fase 4 — Agenda, documentos y reportes:** citas, firmas, documentos, gestión humana / nómina.
- **Fase 5 — Migración de datos, interoperabilidad (RIPS/FEV/HCE) y app de campo offline.**

> Estrategia recomendada: **estrangulamiento progresivo** (la app legada sigue operando hasta el corte por módulo).

---

## 11. Entregables esperados

- Código en GitHub (frontend + supabase + scripts) con README y `.env.example`.
- Esquema de BD con migraciones y políticas RLS.
- Catálogo de roles/permisos y matriz de acceso.
- Documentación de despliegue y de migración de datos.
- Guía de usuario por rol (mínima).

---

## 12. Convenciones

- Idioma de UI: **es-CO**. Código y nombres técnicos: consistentes (❓ Decisión 2: español vs. inglés).
- Commits convencionales; PRs pequeños por módulo; tests en lógica de facturación/auditoría.
- Sin datos reales de pacientes en repos ni en entornos de prueba (usar datos sintéticos).

---

## 13. ❓ Decisiones abiertas para el propietario

1. **Hosting del frontend:** GitHub Pages (estático, como tus otros proyectos) vs. Vercel/Netlify con dominio `cacsantabarbara.co` y mejores controles de seguridad.
2. **Idioma del código/datos:** nombres de tablas y campos en español o inglés.
3. **Modelado de historias clínicas:** tablas tipadas por disciplina vs. cabecera + secciones JSONB validadas.
4. **Acceso a datos legados:** ¿hay acceso a la BD/servidor para una migración directa, o solo exportaciones desde la UI?
5. **Alcance del MVP:** ¿qué sede(s) y qué módulos primero? (sugerido: ADT Palmira + Pacientes e Historia clínica).
6. **Normativa prioritaria:** ¿se requiere RIPS/FEV/HCE interoperable desde el inicio o como fase posterior?
7. **Marca/identidad:** ¿se conserva "SI²T/TodoMed" o se renombra?

---

### Apéndice — Infraestructura del propietario (sin secretos)
- **GitHub:** cuenta disponible (repos + Actions + Pages).
- **Supabase:** cuenta disponible (proyecto a crear/seleccionar).
- **Resend:** cuenta disponible; **dominio `cacsantabarbara.co` verificado** para envío.
- **Credenciales:** las provee el propietario en el entorno seguro al momento de construir; **no se almacenan en este documento ni en el repositorio.**
