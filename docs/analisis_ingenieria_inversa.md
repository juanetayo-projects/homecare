# Ingeniería Inversa — Aplicación HOME CARE (SI2T / ADTWEB)

> Documento de trabajo. Se construye de forma incremental a partir de la navegación por la aplicación.
> Fecha de inicio del análisis: 2026-06-17
> Usuario de prueba: FRIVERA — Sede activa: ADT PALMIRA

---

## 1. Identificación general

- **URL de acceso:** `https://si2t.co/adtweb/web/site/login`
- **Nombre comercial visible:** SI²T (logo) / marca de contenido **TodoMed**
- **Tipo de aplicación:** Sistema de gestión clínica de **atención domiciliaria (Home Care)** con historia clínica electrónica multi-sede.
- **Empresa / contexto:** Prestador de salud domiciliaria (ADT = Atención Domiciliaria) en Colombia, con múltiples sedes: Palmira, Popayán, Tuluá, Cali, Salud Mental, VIH, Sede Administrativa y Central Logística.
- **Versión declarada en UI:** `v 1.0`

## 2. Pila tecnológica (CONFIRMADA por inspección de assets)

| Aspecto | Hallazgo | Fuente |
|---|---|---|
| Framework backend | **Yii Framework 2 (PHP)** — assets `yii.js`, `yii.activeForm.js`, bundles con carpetas hash (`assets/41a64cfe/`), routing `controller/action` (`site/index`, `site/login`) | scripts cargados |
| Estructura de despliegue | Docroot `/adtweb/web/` (patrón estándar Yii2) | URLs |
| Frontend CSS/JS | **Bootstrap 3** (`assets/94c12771/css/bootstrap.min.css` + `bootstrap.min.js`) + plugin `dropdown-x` (menús multinivel BS3) | scripts/links |
| Librería JS base | **jQuery 3.7.1** | `window.jQuery.fn.jquery` |
| Tablas/grillas | **Tabulator 5.5.2** (`js/tabulator5/...`) | scripts |
| Modales / notificaciones | **iziModal** + **notify.min.js** | scripts |
| Lógica de negocio (custom) | `js/pacientes/pacientesAsignados.min.js?version=2.2.0`, `js/festivos.js` | scripts |
| Servidor / hosting | UI muestra IP **190.108.78.182** junto a "Manual" (IP pública colombiana, posible servidor directo) | UI |
| Marca propietaria | Pie de página: **© TodoMed SAS** — desarrollado por **"Rasoft"** (enlace) | UI |

> **Lectura clave:** monolito **PHP/Yii2 + Bootstrap 3 + jQuery** renderizado en servidor. **Bootstrap 3 está descontinuado (EOL 2019)** → principal deuda técnica de frontend. jQuery 3.7.1 es reciente. Tabulator 5 es moderno. No hay framework SPA (React/Vue): la UI se arma con páginas Yii + modales.

## 3. Estructura de navegación (mapa preliminar)

### 3.1 Barra superior

- **Inicio** → listado de historias clínicas del periodo (Mes/Año), con filtros por columna (Tabulator) y exportación a Excel.
- **Cambiar Sede** (multi-sede) — por explorar
- **Informes** (desplegable):
  - *Reportes:* Cuadro de Masivas · Asignación a Profesionales · Cuentas de Cobro · Resumen Cuentas de Cobro
  - Gestión Humana · Datos de Pacientes
  - Derivados
- **Datos** (desplegable):
  - *Facturas:* Pacientes · Profesionales · Usuarios
  - *Tablas:* Paquetes · Servicios · Insumos/Medicamentos · Tablas · Calendario anual
  - Entidades · Contabilidad · Contratos
- **Administrador** (desplegable):
  - Actividades y cierre cuentas · Copiar de un mes a otro · Alimentar datos a Nómina
  - *Administrador:* Subir Firmas · Ver Firmas Registradas · Subir Documentos · Gestionar Infografías
  - **HISTORIAS** (submenú): Auditoría de Historias · Abrir aperturas · Abrir Evoluciones · Abrir Evoluciones de Control · Abrir Terapias · Abrir Notas de Enfermería · Historias Clínicas · Soportes a facturación (médicos / terapias / notas) · Historias de Profesionales · Historias hechas por fecha
- **Salir (FRIVERA) ADT PALMIRA** (logout + usuario + sede activa)

> Nota: el usuario autenticado es **FRIVERA** pero la cabecera de datos muestra **ANDRES RIVERA / Identidad 123321123** (perfil del profesional). El menú **Administrador** está visible para este usuario → sugiere rol con privilegios amplios.

### 3.2 Barra lateral izquierda (módulos clínicos — historia clínica por tipo)

| Módulo | Ruta (Yii `controller/action`) |
|---|---|
| Pacientes | `pacientes` |
| Valoración Clínica Inicial | `historias/apertura?th=<token-cifrado>` |
| Apertura de Historia | `historias/apertura?th=<token-cifrado>` |
| Evolución Médica | `historias/evolucion` |
| Control de Evolución | `historias/evolcontrol` |
| Epicrisis | `historias/epicrisis` |
| Terapia Respiratoria | submenú (Apertura/Evolución) |
| Terapia Física | submenú (Apertura/Evolución) |
| Terapia Ocupacional | submenú (Apertura/Evolución) |
| Curaciones / Escaras | submenú |
| Enfermería | `historias/enfermeria` |
| Fonoaudiología | submenú (Apertura/Evolución) |
| Servicios | `prog-servicios` |
| Nutrición | `historias/nutricion` |
| Gerontología | `historias/gerontologia` |
| Agenda de citas | `cronograma` |

> Observación de seguridad (positiva): el `id` de tipo de historia viaja **cifrado** en el parámetro `th` (ej. `th=ZGZEVnZXRVphOGtIRVo2bmdlQWhNUT09`, base64 sobre un cifrado AES). Mitiga manipulación directa de parámetros (IDOR) en ese campo.

### 3.3 Sedes disponibles (Cambiar Sede)
`ADT CALI`, `ADT PALMIRA`, `ADT TULUÁ`, `ADT POPAYÁN`, `ADT BUENAVENTURA`. (Pantalla `site/cambiar-sede`: un `<select>` + botón "cambiar".)

### 3.4 Mapa de rutas — menú superior

| Sección | Opción | Ruta |
|---|---|---|
| Informes | Cuadro de Masivas | `reportes/masiva` |
| Informes | Asignación a Profesionales | `profesionales/imprime-asignacion` |
| Informes | Cuentas de Cobro | `profesionales/imprime-cuenta-cobro` |
| Informes | Resumen Cuentas de Cobro | `profesionales/resumen-cuentas-cobro` |
| Informes | Gestión Humana | `profesionales/imprime-gestion-humana` |
| Informes | Datos de Pacientes | `impresiones/listado-pacientes` |
| Informes | Derivados | `impresiones/derivados` |
| Datos | Pacientes (facturas) | `pacientes` |
| Datos | Profesionales | `profesionales` |
| Datos | Usuarios | `permisos` |
| Datos | Paquetes | `tablas/paquetes` |
| Datos | Servicios | `prog-servicios` |
| Datos | Insumos/Medicamentos | `tablas/articulos` |
| Datos | Tablas | `tablas/tablas` |
| Datos | Calendario anual | `cronograma/calendario-hor` |
| Datos | Entidades | `tablas/entidades` |
| Datos | Contabilidad | `exportar` |
| Datos | Contratos | `contratos` |
| Administrador | Actividades y cierre cuentas | `registro-actividades` |
| Administrador | Copiar de un mes a otro | `sincronizar/copiar-mes` |
| Administrador | Alimentar datos a Nómina | `profesionales/alimenta-nomina` |
| Administrador | Subir Firmas | `documentos/subir-firmas` |
| Administrador | Ver Firmas Registradas | `documentos/firmas-registradas-profesion...` |
| Administrador | Subir Documentos | `documentos` |
| Administrador | Gestionar Infografías | `infografias` |
| Admin › Historias | Auditoría de Historias | `ver-historias/index` |
| Admin › Historias | Abrir aperturas | `historias/apertura/abrir-apertura` |
| Admin › Historias | Abrir Evoluciones | `historias/evolucion/abrir-evolucion` |
| Admin › Historias | Abrir Evoluciones de Control | `historias/evolcontrol/abrir-evolcontrol` |
| Admin › Historias | Abrir Terapias | `reghistorias/carga-historias2?cr=S` |
| Admin › Historias | Abrir Notas de Enfermería | `historias/enfermeria/abrir-enfermeria` |
| Admin › Historias | Historias Clínicas | `impresiones` |
| Admin › Historias | Soportes a facturación (médicos/terapias/notas) | `impresiones/masivas-medicos` · `masivas-terapias` · `masivas-notas` |
| Admin › Historias | Historias de Profesionales | `reportes/historias-periodo` |
| Admin › Historias | Historias hechas por fecha | `reportes/historias-hechas` |

### 3.5 Pantalla de inicio
- **Inicio (`site/index`):** listado de historias clínicas del periodo (grilla Tabulator) con filtros por columna y exportación a Excel.
- **Menú Lateral (`site/menu-lateral`):** muestra un **Directorio Telefónico 2022** (imagen estática, paginado 1/2) + el menú clínico lateral. Enlace **Manual** con IP `190.108.78.182`. Footer `v 1.0`.

---

## 4. Documentación funcional por módulo (navegación real)

### 4.1 Pacientes (`pacientes`)
- **Listado** tipo Yii GridView: **2.620 pacientes**, paginación 15/página, filtros por columna.
- Columnas: Acción (editar/eliminar), Entidad (EPS, p.ej. EMSSPGPPAL / EMSCenCPALM), Identidad, Sexo, Paciente, Edadmeses, Fec.Nacimiento, Ciudad de atención, Ciudad de visita, Estado (Activo / Alta médica / Rechazado / Trasladado).
- **Formulario de paciente (`pacientes/actualiza-paciente?r=<id-cifrado>`)** — abre en **pestaña nueva**. Modelo de datos muy amplio:
  - *Identificación:* Tipo Identidad, Identidad, Apellidos/Nombres, Rh, Sexo, Estado Civil, Fec.Nacimiento, Email.
  - *Atención:* Tipo Paciente (Agudo/…), Periodo de visitas, Fec.Ingreso, U/R, Tipo de usuario (Subsidiado/…), Entidad, Aceptado, Estado + fecha, Alto riesgo.
  - *Ubicación:* Dirección, Barrio, Teléfonos, Ciudad de atención, Tipo/Con vía, Tipo de inmueble, Comuna.
  - *Social:* Religión, Nivel educativo, Etnia, Responsable + teléfonos.
  - *Pestañas:* **Diagnósticos** (CIE-10, p.ej. `R53X`), Últimos Diagnósticos, Vivienda, Otros Datos; checkboxes de riesgo (Inestabilidad hemodinámica, Riesgo vital, etc.) y Médico tratante.

### 4.2 Usuarios / Permisos (`permisos`)
- **931 cuentas** de usuario; la mayoría en estado **"No activo"**.
- Columnas: Usuario (login), Sede, Nombres, Apellidos, Correo, Activo, Acción (eliminar / gestionar permisos).
- **Modelo de permisos:** modal de edición con pestañas por área — **Médico, Terapeuta, Nómina, Admisiones, Medic/Insum/Sumin, Administrador** — y dentro, **checkboxes granulares** (Consultar Pacientes, Valoración Clínica Inicial, Apertura de Historia, Evolución Médica, Control de Evolución, Epicrisis, Ver Historias, Nutricionista, Pant. de Pacientes Asignados…). Es un esquema de **permisos por bandera, asignados usuario por usuario** (no roles reutilizables).
- Campos del usuario: Usuario/Email, Cédula, Nombres/Apellidos, **Contraseña**, Correo, Estado, Registro médico, Especialidad, Sede, "Color para la agenda".

### 4.3 Agenda de citas (`cronograma`)
- Calendario (estilo FullCalendar) con vistas **Día / 4 días / Semana / Agenda / Mes**, navegación de fechas, "Hoy".
- Filtros por **Consulta** y **Médico**; tamaño de franja configurable (p.ej. 20 min). Acciones de crear (+) y eliminar.

### 4.4 Historia clínica — Apertura (`historias/apertura?th=<token-cifrado>`)
- Formulario clínico de **página única**, en secciones numeradas: **1. Datos del Usuario** (buscador de paciente, datos demográficos, Tipo de consulta, **Cuidadores**, Tipo de paciente), **2. Motivo Consulta** (Motivo, Enfermedad actual, Ayudas diagnósticas), **3. Revisión por Sistemas** (General, Respiratorio, Genitourinario…), etc.
- Botón **Grabar** fijo (sticky) a la derecha. Encabezado con fecha/hora y médico.
- Variantes por disciplina comparten patrón: Evolución Médica, Control de Evolución, Epicrisis, Enfermería, Nutrición, Gerontología y Terapias (Respiratoria/Física/Ocupacional/Fonoaudiología, cada una con Apertura + Evolución).

### 4.5 Programación de Servicios (`prog-servicios`) — núcleo operativo/facturación
- Asigna a cada paciente **paquetes/servicios** con: **Cód. CUPS**, Servicio/Paquete, cantidad, **Tarifa**, **Núm. de autorización** (EPS), **Fec. autorización**, **Fec. vencimiento**, **Periodo** (Diaria/…).
- Pestañas: **Items del paquete, Modificación Paquete, Asignar Servicios, Adic. Medics/Insum/Sumin.** Trabaja por **periodo (Mes/Año)**.
- Es el puente entre la prestación domiciliaria y la **facturación a EPS** (autorizaciones, CUPS, tarifas, insumos/medicamentos).

### 4.6 Inicio (`site/index`)
- Grilla **Tabulator 5** de historias del periodo (Mes/Año) con filtros por columna y **exportación a Excel**. Columnas: Ref, Identidad, Estado, Paciente, Tipo Historia, CUPS, Asig., Hechas, EV, Fec.Atención, Tipo Consulta, Medio, Enlace.

### 4.7 Tablas maestras (Datos)
- **Tablas paramétricas (`tablas/tablas`):** maestro genérico con **7.609 ítems**. Una sola tabla guarda catálogos heterogéneos distinguidos por "Tipo" (Líneas, Grupos, Impuestos…). Los Impuestos referencian códigos **PUC contables** (110505, 530535). ⚠️ El campo "Tipo" tiene valores inconsistentes ("Grupos" vs. "4"/"0").
- **Entidades (`tablas/entidades`):** **75 EPS/pagadores** (EMSSANAR, SELVASALUD, ASMET…) con Código, Unidad (VIH/ADT/Salud Mental), NIT, Nombre, Activo. Dirección/teléfono/email mayormente vacíos.
- **Paquetes de Servicios (`tablas/paquetes`):** catálogo de **5.656 ítems facturables** (procedimientos **CUPS**, insumos/medicamentos, servicios y paquetes) con Tipo, Valor y tarifas **Urbano/Rural Profesional** y Cód. Facturación.
- **Medicamentos/Insumos/Suministros (`tablas/articulos`):** **2.332 ítems** (Estado, Código, Código CUP, Descripción, Grupo, Línea). ⚠️ Mayoría con **Descripción vacía** y Grupo "--".
- **Contratos (`contratos`):** contratos con EPS (Número, Fechas, Valor, Régimen). **Sin registros en esta sede.**

### 4.8 Reportes (Informes)
- **Cuadro de Masivas (`reportes/masiva`) — "Genera Masivas":** generación de facturación masiva por **rango de fechas + selección de EPS (checkboxes) + filtro por CIE-10**; con "Versión 2" del reporte. (Etiqueta duplicada en breadcrumb: "Genera GENERA MASIVAS".)
- Otros: Asignación a Profesionales, Cuentas de Cobro, Resumen Cuentas de Cobro, Gestión Humana, Datos de Pacientes, Derivados, Soportes a facturación (médicos/terapias/notas), Historias de Profesionales, Historias hechas por fecha.

### 4.9 "Auditoría de Historias" (`ver-historias/index`) — en realidad un visor
- Es un **visor consolidado del histórico clínico por paciente**: selección de paciente + rango de fechas + **checkboxes por tipo de documento** (Aperturas, Evoluciones, Control de Evoluciones, Test/Trabajo Social, Notas Enfermería, Terapias Física/Ocupacional/Respiratoria/Fono, Nutrición, Psicología).
- ⚠️ **No es una bitácora de auditoría de accesos** (no registra quién vio/editó qué). Confirma el hallazgo de seguridad **S5**.

---

## 5. Observaciones de mejora (consolidadas)

### 5.1 🔴 Seguridad y cumplimiento (prioridad máxima)

| # | Hallazgo | Riesgo | Recomendación |
|---|---|---|---|
| S1 | **Contraseñas en texto plano.** El campo "Contraseña" del usuario es `type=text` y muestra la clave real (ej. `TODOMED2023#`). El servidor la re-inyecta → **almacenamiento reversible/plano en BD**. | **Crítico.** Cualquier admin ve las claves de los 931 usuarios; una fuga de BD las expone todas. Incumple Ley 1581/2012 y buenas prácticas. | Migrar a **hash irrecuperable** (bcrypt/Argon2). Nunca devolver la clave al formulario (dejar en blanco = "no cambiar"). Forzar restablecimiento masivo tras el cambio. |
| S2 | **Exposición de IP del servidor** (`190.108.78.182`) en la UI. | Medio. Facilita reconocimiento/ataque directo. | Quitar la IP de la interfaz; servir el manual por dominio/ruta interna. |
| S3 | **Higiene de cuentas:** 931 usuarios, mayoría inactivos; correos placeholder `sincorreo@correo.com`. | Medio. Superficie de ataque amplia; recuperación de contraseña inviable; trazabilidad débil. | Depurar/inactivar cuentas, exigir email real verificado, MFA para perfiles administrativos. |
| S4 | **Autorización por banderas por usuario** (no RBAC con roles). | Medio. Difícil de auditar y propenso a errores de asignación. | Definir **roles** (Médico, Terapeuta, Enfermería, Admisiones, Facturación, Admin) y asignar permisos por rol; sede como dimensión de alcance. |
| S5 | **Datos de salud (PHI) sensibles** en todas las pantallas (nombre, cédula, diagnósticos, dirección). | Alto regulatorio. | Cifrado en reposo, registro de **auditoría de accesos** (quién vio/editó qué historia), política de retención y backups cifrados. Alinear con Res. 1995/1999, Res. 866/2021 y Habeas Data. |
| S6 | Verificar **TLS** (la app usa `https://si2t.co`, correcto) y endurecer cabeceras (HSTS, CSP, X-Frame-Options) y cookies de sesión (`HttpOnly`, `Secure`, `SameSite`). | Medio. | Auditoría de cabeceras y configuración de sesión Yii. |

> ✅ **Aspecto positivo:** los identificadores sensibles viajan **cifrados** en parámetros de URL (`r`, `th` → base64 sobre cifrado), lo que mitiga manipulación directa (IDOR). Conviene confirmar que el servidor **valida también el alcance por sede/rol** y no solo descifra el id.

### 5.2 🟠 Tecnología y obsolescencia

| # | Hallazgo | Recomendación |
|---|---|---|
| T1 | **Bootstrap 3 (descontinuado desde 2019)** + plugin `dropdown-x`. Principal deuda de frontend. | Migrar el frontend; en una reescritura, adoptar un design system moderno. |
| T2 | **Monolito Yii2 con render en servidor**, sin capa SPA; recargas de página completas y apertura de pantallas en **pestañas nuevas**. | Separar **API (backend) + SPA (frontend)** o, si se mantiene Yii, modularizar y exponer API REST/JSON. |
| T3 | **Librerías de grilla mezcladas:** Tabulator 5 en Inicio vs. Yii GridView en Pacientes. Inconsistencia de UX y mantenimiento. | Unificar en una sola librería de tablas. |
| T4 | Versión de **PHP/Yii por confirmar**; "v 1.0" sugiere base antigua. | Inventariar versiones (PHP, Yii, dependencias) y planear actualización de soporte. |
| T5 | jQuery 3.7.1 (vigente) y Tabulator 5.5.2 (moderno): no son el problema; el problema es la arquitectura general. | Mantener estas piezas si se hace modernización progresiva. |

### 5.3 🟡 UX / usabilidad

- **U1.** La pantalla "Menú Lateral" usa un **directorio telefónico en imagen estática (2022)** como contenido principal → poco accionable y desactualizado. Sustituir por un **dashboard** con indicadores (historias pendientes, citas del día, autorizaciones por vencer).
- **U2.** **Formularios extensos de página única** (paciente, apertura de historia) con muchísimos campos → fatiga y errores. Dividir en **pasos/wizard**, autoguardado y validación en línea.
- **U3.** Etiquetas poco claras y derivadas de BD: "Edadmeses", "Niveleduc", "Color para la agenda: Windows 7". Normalizar etiquetas legibles y catálogos.
- **U4.** Apertura de edición en **pestañas nuevas** del navegador → desorientación. Usar modales/rutas dentro de la SPA.
- **U5.** **Periodo Mes/Año** por defecto en "Enero 2024" (no el periodo actual) → confusión y listados vacíos. Predeterminar al periodo vigente.
- **U6.** Sin diseño **responsive** evidente (layout de escritorio denso). Necesario para uso en campo/tablet por equipos domiciliarios.

### 5.4 🔵 Calidad de datos

- "Ciudad de visita" en **(no definido)** en muchos pacientes; correos placeholder; mezcla de catálogos. Definir campos obligatorios, catálogos controlados y reglas de validación.

### 5.5 Funcionalidad (oportunidades)

- **Auditoría de accesos** a historia clínica (requisito normativo y de seguridad).
- **Interoperabilidad** (Res. 866/2021 — HCE interoperable; RIPS; FEV electrónica) para intercambio con EPS y MinSalud.
- **App móvil/offline** para profesionales en visita domiciliaria.
- **Tablero de indicadores** clínicos y de facturación (autorizaciones por vencer, glosas, productividad).
- **Firma electrónica** integrada al flujo (hoy "Subir Firmas" es un proceso manual de carga de imágenes).

---

## 6. Ruta de modernización sugerida

> Alineada con el stack que ya manejas en tus otros proyectos (**React + Supabase**), aunque para volumen y normativa de salud conviene evaluar también backend dedicado.

**Fase 0 — Contención de seguridad (inmediata, sin reescribir):**
1. Corregir **contraseñas en texto plano** (hash + reset masivo) — **S1**.
2. Quitar IP del servidor de la UI — **S2**.
3. Depurar cuentas y exigir emails reales + MFA admin — **S3**.
4. Endurecer cabeceras y cookies de sesión — **S6**.

**Fase 1 — Documentación y modelo de datos (en curso):**
- Completar el **modelo de datos** (pacientes, historias por tipo, servicios/CUPS/autorizaciones, profesionales, permisos, agenda).
- Inventario de reportes y reglas de negocio (cuentas de cobro, nómina, soportes a facturación).

**Fase 2 — Arquitectura objetivo:**
- **Backend/API** con autenticación moderna (JWT/OAuth, RBAC por rol y sede, auditoría).
- **Frontend SPA** (React) responsive, formularios en wizard con autoguardado.
- **Base de datos** relacional con cifrado en reposo y RLS por sede/rol (Supabase/Postgres es viable; validar capacidad para PHI y backups).

**Fase 3 — Migración por módulos** (estrangulamiento progresivo): Pacientes → Historias clínicas → Programación de servicios/Facturación → Reportes → Agenda, manteniendo la app actual en paralelo hasta el corte.

**Fase 4 — Interoperabilidad y móvil:** HCE interoperable, RIPS/FEV, app de campo offline.

---

## 7. Pendientes / por profundizar (opcional)

- [x] Revisar módulos Datos › Tablas, Entidades, Contratos, Paquetes, Insumos/Medicamentos. *(ver 4.7)*
- [x] Revisar reporte Cuadro de Masivas. *(ver 4.8)*
- [x] Aclarar "Auditoría de Historias" (es un visor, no bitácora). *(ver 4.9)*
- [ ] Confirmar versión de PHP/Yii y dependencias (acceso a servidor o cabeceras).
- [ ] Detallar reportes Cuentas de Cobro / Soportes a facturación y su lógica de cálculo.
- [ ] Detallar submenús de terapias (Apertura/Evolución por disciplina — mismo patrón que 4.4).
- [ ] Validar comportamiento de "Copiar de un mes a otro" y "Alimentar datos a Nómina".
- [ ] Confirmar en backend que el descifrado de `r`/`th` va acompañado de **control de acceso por sede/rol**.
