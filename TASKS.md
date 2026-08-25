# Frontend — Cola de tareas para construcción

> Extraído de `docs/PLAN_PROYECTO_PAWCARE.md` (referencia, no editar desde aquí). Cada tarea es un prompt autocontenido, en orden de ejecución, numerado para alinear con `backend/TASKS.md`. El estilo visual de referencia está en `../docs/images/17-*.png` a `23-*.png` (header con gradiente, tarjetas, tablas) — es guía de UX, no código a copiar.

**Stack:** React + Vite + TypeScript + Tailwind CSS, consumiendo el backend por API REST.

**Definition of Done por tarea:** pantalla(s) implementadas · consume los endpoints reales de la tarea equivalente en `backend/TASKS.md` (no datos mockeados permanentes) · maneja estados de error/validación descritos en los criterios de aceptación · responsive (funciona en escritorio, tablet y móvil, principio de diseño del proyecto).

---

## Progreso

> **⚠️ Nombres antiguos en el historial:** todo lo que sigue (Progreso y sesiones 1–6) quedó escrito con los nombres en español que el proyecto usaba en ese momento (`Mascota`, `/api/mascotas`, `estado: ACTIVO`, …). En la **sesión 7** el código pasó íntegramente a inglés y las tablas al prefijo `st_` — se dejó el historial tal cual, como registro de lo que se hizo cuándo. Para traducir cualquier nombre viejo al actual, usá [`docs/GLOSARIO_EN_ES.md`](../docs/GLOSARIO_EN_ES.md).

> El backend ahora persiste en PostgreSQL real (Supabase) vía Prisma — ver `backend/TASKS.md`. El frontend no cambió: siempre consumió la API real por HTTP, nunca datos mockeados en el propio frontend, así que la migración de datos en memoria a base de datos fue transparente para esta capa. `[x]` = construido y funcionando; `[ ]` con nota "parcial" = existe algo pero no cumple la HU completa; sin nota = no empezado.

- [x] Tarea 00 — Setup del frontend
- [x] Tarea 01 — HU1: Login y layout por rol — completa, incluyendo **Gestión de Usuarios** (`/app/usuarios`, solo Administrador): alta con rol, y campos de matrícula/especialidad condicionales cuando rol=Veterinario (crea también el registro de Veterinario vinculado por `usuarioId`)
- [x] Tarea 02 — HU2: Registro de Mascotas y Cliente — completa: `MascotasPage` con listado + formulario de alta (mascota + propietario) con detección automática de propietario existente por CI (`GET /api/propietarios/buscar`, `POST /api/mascotas`)
- [x] Tarea 03 — HU3: Atención Médica — completa: búsqueda de mascota por CI del propietario (componente compartido `BuscadorMascotaPorCi`), historial médico, formulario de nueva atención con veterinario bloqueado a "sí mismo" cuando el rol es Veterinario
- [x] Tarea 04 — HU4: Registrar Pagos
- [x] Tarea 05 — HU5: Agendar, Reprogramar y Cancelar Citas — completa: agendar, **reprogramar** (la pestaña "Nueva Cita" cambia a modo edición, solo permite mover fecha/hora), cambiar estado, disponibilidad agrupada Mañana/Tarde, y la restricción de rol aplicada también a Reprogramar (un veterinario no reprograma citas ajenas)
- [x] Tarea 06 — HU6: Control de Vacunación y Desparasitación — completa: panel "Próximos a vencer" (30 días) + búsqueda por CI + historial por mascota con badge "Vencido" + registro de nuevo control
- [x] Tarea 07 — HU7: Reporte de Ingresos Económicos — completa: filtros (fecha, tipo de servicio, método de pago), totales, tabla — pestaña "Ingresos" en `/app/reportes`
- [x] Tarea 08 — HU8: Reportes Clínicos y Administrativos — completa: selector de reporte, gráfico de barras (Recharts) de ingresos por tipo de servicio, tabla de atenciones por período, exportar PDF/Excel — pestaña "Clínicos y Administrativos" en `/app/reportes`
- [x] Tarea 09 — HU9: Gestión de Inventario de Medicamentos — completa: listado + alerta de bajo stock + registrar entrada en `/app/inventario`; el formulario de Nueva Atención permite seleccionar medicamentos consumidos (descuenta stock automáticamente)
- [x] Tarea 11 (opcional) — HU11 Track A: Panel de recordatorios WhatsApp — completa: `/app/recordatorios` lista citas <24h y controles <7 días, botón abre `wa.me` con mensaje precargado, "Marcar como enviado"
- [ ] Tarea 12 (opcional) — HU11 Track B: Panel de entregabilidad — **fuera de alcance a propósito**: requiere credenciales reales de WhatsApp Cloud API (Meta), no se puede simular sin engañar
- [x] Tarea 13 (opcional) — HU12: Pago por QR — completo: "QR" disponible como método de pago y como filtro en el Reporte de Ingresos (HU7)
- [x] Tarea 14 (opcional) — HU13: Importación desde Excel — completa: botón "Importar Excel" en Mascotas (solo Admin), muestra importados vs. filas con error
- [x] Tarea 15 (opcional) — HU14: PWA instalable — completa: `vite-plugin-pwa` configurado, manifest + service worker verificados con `npm run build`
- [x] Tarea 16 (opcional) — HU15: Exportación completa de datos — completa: botón en Configuración (solo Admin), descarga un Excel con una hoja por entidad

**Todo lo planeado está construido**, salvo HU11 Track B (documentado como fuera de alcance por depender de un servicio externo real).

**Construido y no estaba en esta lista original:** pantalla de **Configuración** (`/app/configuracion` — tema claro/oscuro/sistema + datos de cuenta + exportación completa) y **Dashboard con KPIs reales** (mascotas registradas, citas de hoy, pagos pendientes), agregados durante la iteración de diseño.

*(HU10 — Alertas Automáticas — es el job de backend detrás de la Tarea 11; no tiene pantalla propia.)*

---

## Gaps cerrados (sesión posterior — análisis de brechas contra este documento)

- [x] **Ficha individual de mascota** (`/app/mascotas/:id`) — datos completos + botón Editar, gráfico de evolución de peso (Recharts, se muestra solo con ≥2 mediciones), y línea de tiempo unificada (atenciones, controles preventivos, citas, ediciones manuales) con ícono/badge por tipo. El formulario de Nueva Atención ganó un campo opcional "Peso actual" que alimenta el gráfico. El listado de Mascotas ahora navega a la ficha al hacer clic en una fila.
- [x] **Gestión de Horarios** (`/app/horarios`) — ítem que quedaba explícitamente pendiente en la nota de arriba. Grilla semanal (hasta 2 turnos por día) — Administrador elige veterinario, Veterinario ve el suyo bloqueado (mismo patrón "Tú" que Nueva Cita/Nueva Atención). Sin cambios en la pantalla de Citas: el contrato de `GET /citas/disponibilidad` no cambió de forma, solo pasó a reflejar los horarios reales.
- [x] **Pantalla de Propietarios** (`/app/propietarios`) — listado con cantidad de mascotas por dueño + edición (nombre, apellido, teléfono; el CI no es editable).
- [x] **Desactivar usuario/veterinario** — badge de estado + botón Activar/Desactivar (con confirmación) en Gestión de Usuarios. Los selectores de veterinario en Nueva Cita/Nueva Atención/Horarios ahora piden solo veterinarios activos.
- [x] **Paginación** — Mascotas y Usuarios muestran controles Anterior/Siguiente (componente `Pagination` reutilizable) cuando hay más de una página. Citas sigue mostrando el listado completo (agenda agrupada por día — paginar ahí partiría un día a la mitad); el KPI "Mascotas registradas" del Dashboard ahora usa el total real del backend en vez de contar solo la página cargada.

**Todo lo del análisis de gaps está cerrado**, salvo HU11 Track B (sin cambios, sigue fuera de alcance).

---

## Correcciones y mejoras (sesión 3 — feedback de uso real)

- [x] **Bug de Horarios corregido** — `HorariosPage.tsx` (`estadoDesdeHorarios`) reasignaba los switches turno1/turno2 por orden de `horaInicio` al recargar desde el backend (que solo guarda una lista plana, sin etiqueta de turno), así que un día con solo el turno de tarde activo terminaba mostrado en el switch de "mañana". Ahora se reconstruye por franja horaria real (antes/después del mediodía), no por orden de llegada.
- [x] **Cambio de rol en Usuarios** — nuevo botón "Cambiar rol" por fila (oculto en la propia cuenta del admin logueado), `CambiarRolDialog.tsx`: si el rol elegido es Veterinario y el usuario no lo era, pide matrícula/especialidad.
- [x] **CRUD completo de Medicamentos** en `/app/inventario` — "Nuevo medicamento", "Editar" y "Eliminar" (con modal de confirmación) junto al ya existente "Registrar entrada".
- [x] **Historial de últimas transacciones** — Pagos (`/app/pagos`) y Recordatorios (`/app/recordatorios`) ganaron una segunda sección "Últimos pagos"/"Últimos enviados" (top 5, más reciente primero), antes solo mostraban lo pendiente.
- [x] **Atención Médica más completa** — estado vacío inicial (antes de buscar mascota) con ícono y guía; estado vacío con mascota seleccionada más orientador; header de la ficha ahora muestra sexo/edad/peso (helper `calcularEdad` extraído a `lib/mascota.ts`, compartido con la ficha de mascota); cada fila del historial muestra `peso` y `examenesExternos` (se capturaban en el formulario pero no se mostraban de vuelta).
- [x] **Eliminar mascota** — botón "Eliminar mascota"/"Reactivar" en la ficha (`MascotaDetallePage.tsx`), con modal de confirmación (borrado lógico, reversible). `MascotasPage.tsx` ganó un toggle "Mostrar inactivas" (oculto por defecto) y un buscador por nombre.
- [x] **Propietarios más completo** — columna Dirección (editable), y las mascotas de cada propietario se muestran como chips clicables (en vez de solo un número) que navegan a la ficha de la mascota; buscador por nombre/CI.

**Datos demo regenerados** — ver `backend/TASKS.md` para el detalle de conteos; usuarios/mascotas/veterinarios/etc. tienen nombres nuevos, el doble de contenido.

---

## Correcciones y mejoras (sesión 4 — login, alta de veterinarios, contraseñas, temas de color, modales)

- [x] **Bug corregido: contraseña incorrecta recargaba la página** — causa real en `lib/api-client.ts` (ver `backend/TASKS.md`), no en `LoginPage.tsx`.
- [x] **Login rediseñado** — mostrar/ocultar contraseña (ícono de ojo), enlace "¿Eres veterinario y no tienes cuenta? Solicita tu acceso" hacia `/registro`, pulido visual general; se quitó la línea de credenciales demo de veterinario (el username ya no es estable, cambia en cada reseed).
- [x] **Pantalla pública de preregistro de Veterinario** (`/registro`, `RegistroVeterinarioPage.tsx`) — formulario completo (datos personales + matrícula/especialidad + contraseña), envía a `POST /api/usuarios/preregistro` y muestra una pantalla de confirmación ("un Administrador debe aprobar tu cuenta") en vez de loguear automáticamente, porque la cuenta queda `INACTIVO` hasta la aprobación.
- [x] **Aprobar veterinarios pendientes y restablecer contraseñas** (`/app/usuarios`, solo Administrador) — badge "Pendiente de aprobación" (en vez de "Inactivo") y el botón cambia a "Aprobar" para las cuentas autorregistradas (`esPendienteDeAprobacion()`); nuevo botón "Restablecer contraseña" por fila (`RestablecerPasswordDialog.tsx`) para cuando un usuario perdió el acceso.
- [x] **Cambiar mi contraseña** — nueva card en `/app/configuracion` (`CambiarPasswordDialog.tsx`), pide la contraseña actual + la nueva, disponible para cualquier rol.
- [x] **Temas de color** (`/app/configuracion` → Apariencia) — además de Claro/Oscuro/Sistema, ahora hay 3 acentos de color (Violeta/Océano/Rosa) combinables con cualquiera de los tres modos. Sistema nuevo e independiente de `next-themes`: `features/color-theme/ColorThemeContext.tsx` (`data-color-theme` en `<html>`, persistido en `localStorage`), variables CSS por tema en `index.css`. Los tres pasaron por validación de contraste WCAG real (no a ojo) contra el mismo baseline que ya tenía el violeta original.
- [x] **Modales largos ya no se cortan** — bug real: `NuevaAtencionDialog` (y por el mismo motivo, potencialmente cualquier formulario largo) podía crecer más alto que la ventana, dejando el botón "Guardar" inalcanzable, con un scroll interno mal armado encima. Se arregló en la base (`components/ui/dialog.tsx`: `DialogContent` ahora tiene `max-h` + `flex-col` + scroll de respaldo, aplica a **todos** los diálogos automáticamente) y se rediseñaron a fondo los tres formularios más largos (`NuevaAtencionDialog`, `NuevoUsuarioDialog`, `NuevaMascotaDialog`): más anchos, con cabecera y pie fijos y solo el cuerpo de campos con scroll.
- [x] **Componente `Textarea` compartido** (`components/ui/textarea.tsx`) — reemplazó 4 `<textarea>` escritos a mano con estilos ligeramente distintos entre sí (y distintos de `Input`); ahora un solo componente, mismos tokens que `Input`.
- [x] **Auditoría de `alert()`/`confirm()`/`prompt()` nativos** — cero resultados en todo `frontend/src`; toda confirmación ya pasaba por `Dialog` y todo feedback por `sonner` (toast), no se necesitó ningún cambio.

---

## Correcciones y mejoras (sesión 5 — recuperación de contraseña, invitación de veterinarios, auditoría)

- [x] **Recuperar contraseña** — nuevo enlace "¿Olvidaste tu contraseña?" en `LoginPage.tsx` hacia `/olvide-password` (`OlvidePasswordPage.tsx`): pide solo el `username`, llama a `POST /api/auth/forgot-password` y siempre muestra la misma confirmación genérica ("si la cuenta existe... te enviamos un enlace"), nunca revela si el usuario existe o tiene email. `/restablecer-password` (`RestablecerPasswordPage.tsx`) lee el `token` de la URL y pide la contraseña nueva (+ confirmación), llama a `POST /api/auth/reset-password`; muestra el error del backend si el token ya venció o se usó.
- [x] **Invitar Veterinario** (`/app/usuarios`, solo Administrador) — nuevo botón "Invitar veterinario" abre `InvitarVeterinarioDialog.tsx` (email + nombre opcional). El listado de invitaciones pendientes vive en la misma pantalla de Usuarios. Pantalla pública `/invitacion` (`InvitacionPage.tsx`): valida el token contra `GET /api/usuarios/invitaciones/validar/:token`, precarga el email, y pide el resto de datos (personales + matrícula/especialidad + contraseña) antes de enviar a `POST /api/usuarios/invitaciones/aceptar/:token`. A diferencia de `/registro` (preregistro), no muestra pantalla de "pendiente de aprobación" — la cuenta queda activa de inmediato y redirige a iniciar sesión.
- [x] **Pantalla de Auditoría** (`/app/auditoria`, solo Administrador — nuevo módulo del sidebar vía `GET /api/dashboard/modulos`) — tabla paginada de `GET /api/auditoria`: fecha, tipo de acción (badge con color por tipo), quién la realizó, detalle en texto libre. Sin filtros ni acciones, es un log de solo lectura.
- [x] **Campo Email en Gestión de Usuarios** — `NuevoUsuarioDialog.tsx` ganó un campo opcional "Email" (necesario para que esa cuenta pueda usar "olvidé mi contraseña" más adelante). **Nota:** `prisma/seed.ts` no siembra `email` para ninguna de las cuentas demo, así que "olvidé mi contraseña" no tiene ningún usuario contra el que probar hasta que un Administrador cree uno nuevo con email desde esta pantalla (no hay edición de email sobre un usuario ya existente todavía).

---

## Correcciones y mejoras (sesión 6 — botón "Cobrar con QR" en Pagos, banco todavía no conectado)

- [x] **Botón "Cobrar con QR"** en `/app/pagos` (`PagosPage.tsx`), junto al ya existente "Registrar pago" en cada fila de pendientes. Abre `CobroQrDialog.tsx`, que genera el intento de cobro (`POST /api/pagos/qr`) apenas se abre y, si se genera con éxito, hace polling cada 3s (`useCobroQr`, sin websockets en el proyecto) contra `GET /api/pagos/qr/:id` hasta que el backend reporte `CONFIRMADO`/`EXPIRADO`/`ERROR`.
- [x] **Hoy siempre muestra el error honesto del backend** ("El cobro por QR bancario no está disponible todavía en este entorno...") en vez de un QR falso — el backend (`lib/pagoQr.ts`, ver `backend/TASKS.md` sesión 6) no tiene ningún banco conectado todavía. El diálogo ya está listo para mostrar el QR real (imagen si `qrPayload` es una URL, o el contenido crudo si no) apenas el backend empiece a devolver uno de verdad — no hará falta tocar el frontend.
- [x] **Al confirmarse un cobro**, invalida `["pagos", "pendientes"]` y `["pagos", "historial"]` (mismo criterio de invalidación por prefijo que ya usa el resto de la app) para que la fila desaparezca de pendientes y aparezca en "Últimos pagos" sin recargar.
- [x] **Probado en navegador real** (Playwright, ver `backend/TASKS.md` sesión 6 para el detalle de la corrida) contra el backend real: login, ir a Pagos, clic en "Cobrar con QR" sobre una atención pendiente real, el diálogo muestra los datos correctos y el mensaje de error esperado, sin errores de consola aparte del 500 esperado.

---

## Correcciones y mejoras (sesión 7 — código en inglés, UI en español)

Contraparte frontend del refactor de nomenclatura descrito en `backend/TASKS.md` sesión 7. Sin cambios funcionales ni de diseño: **ninguna pantalla cambió de aspecto ni de comportamiento**, solo los identificadores del código.

- [x] **`features/` y `pages/` renombrados** — las 18 carpetas de features (`mascotas`→`pets`, `atenciones`→`medical-visits`, `citas`→`appointments`, `controles-preventivos`→`preventive-controls`, `propietarios`→`owners`, `veterinarios`→`vets`, `usuarios`→`users`, `medicamentos`→`medications`, `pagos`→`payments`, `recordatorios`→`reminders`, `reportes`→`reports`, `auditoria`→`audit-logs`, `horarios`→`schedules`, `importaciones`→`imports`, `exportacion`→`exports`) y sus 12 carpetas de páginas equivalentes, con todos sus componentes (`MascotasPage`→`PetsPage`, `NuevaAtencionDialog`→`NewVisitDialog`, `CobroQrDialog`→`QrChargeDialog`, …). También `lib/mascota.ts`→`lib/pet.ts`, `lib/tipos-servicio.ts`→`lib/service-types.ts` y `components/BuscadorMascotaPorCi.tsx`→`components/PetSearchByNationalId.tsx`.
- [x] **Tipos y hooks alineados al nuevo contrato del backend** — `Mascota`→`Pet`, `AtencionMedica`→`MedicalVisit`, `useMascotas`→`usePets`, `usePagosPendientes`→`usePendingPayments`, etc. Las **claves de caché de TanStack Query** también cambiaron (`["mascotas"]`→`["pets"]`, `["pagos","pendientes"]`→`["payments","pending"]`), respetando la invalidación por prefijo cruzada que ya existía entre features.
- [x] **Rutas del frontend en inglés** — `/app/mascotas`→`/app/pets`, `/app/atencion-medica`→`/app/medical-visits`, `/app/configuracion`→`/app/settings`, etc., y las públicas `/registro`→`/register`, `/olvide-password`→`/forgot-password`, `/restablecer-password`→`/reset-password`, `/invitacion`→`/invitation`. El backend genera estas mismas rutas (`dashboard.service.ts` para el sidebar; `auth.service.ts`/`vetInvitation.service.ts` para los links de email), así que ambos lados quedaron sincronizados.
- [x] **Traducción de enums en el borde de la UI** — como los valores ahora viajan en inglés, `StatusBadge.tsx` y `lib/roles.ts` mapean cada valor a su etiqueta en español (`PENDING`→"Pendiente", `ADMIN`→"Administrador", `VACCINE`→"Vacuna", …). El valor derivado `PENDING_APPROVAL` (que no existe en el backend) se mantiene, ahora calculado como `selfRegistered && status === "INACTIVE"`.
- [x] **Todo el texto visible sigue en español** — labels, placeholders, toasts, estados vacíos, mensajes de error y comentarios del código quedaron intactos. Se hizo una auditoría específica sobre los nodos de texto JSX (que, al no estar entre comillas, eran el punto donde un renombrado automático podía filtrar inglés a la pantalla) y se corrigieron 23 archivos donde eso había pasado.
- [x] **Verificado**: `npx tsc -b --noEmit` limpio, `npm run lint` (oxlint) limpio, `npm run build` genera el bundle + service worker de la PWA sin errores. El contrato contra el backend se validó con el servidor real corriendo (ver `backend/TASKS.md` sesión 7).

**Deuda conocida que este refactor NO tocó:** el frontend sigue sin ningún test automatizado (ver `docs/MEJORAS_PRODUCTO.md` 4.2) — la red de seguridad de esta migración fue TypeScript, no una suite de pruebas.

---

## Correcciones y mejoras (sesión 8 — menú agrupado y dos pantallas fusionadas)

El sidebar tenía 13 ítems planos. Se agruparon en 4 secciones y se fusionaron dos pares de pantallas que en realidad son la misma tarea.

- [x] **Sidebar agrupado en Clientes / Clínica / Administración / Sistema** — los grupos, su orden y qué módulo cae en cada uno los define el backend (`dashboard.service.ts`, campo `group` + `GET /api/dashboard/modules` que ahora devuelve `{ modules, groups }`). Un grupo sin módulos para ese rol no se dibuja: un Veterinario no ve "Administración". Las tarjetas de acceso rápido del Dashboard usan la misma agrupación.
- [x] **Agenda = Citas + Horarios** (`/app/appointments`) — `SchedulesPage` pasó a ser `SchedulesTab` dentro de la pantalla de Citas. Van juntas porque el horario del veterinario es lo que determina qué bloques quedan libres al agendar; tenerlas separadas obligaba a saltar de pantalla para entender la disponibilidad.
- [x] **Usuarios = Cuentas + Auditoría** (`/app/users`) — `AuditLogPage` pasó a ser `AuditLogTab`, y el listado anterior a `UsersListTab`. La auditoría es la bitácora de las acciones administrativas sobre esas mismas cuentas, así que se lee al lado del listado.
- [x] **Qué pestañas ve cada rol lo manda el backend** (campo `tabs` del módulo), no una tabla de roles en el frontend — mismo criterio que ya regía para los módulos del sidebar. Una Recepcionista agenda citas pero no edita horarios ajenos, así que su módulo "agenda" llega sin la pestaña `schedules`.
- [x] **`Configuración` dejó de estar clavada al pie del sidebar** y pasó a ser un módulo más, dentro del grupo Sistema. Así todos los roles tienen un grupo Sistema coherente y el pie queda solo con el menú de cuenta.
- [x] **Rutas viejas redirigidas** — `/app/schedules` → `/app/appointments` y `/app/audit-log` → `/app/users`, para no romper enlaces guardados.

**Bug encontrado y corregido de paso:** los KPIs del Dashboard (Mascotas registradas, Citas de hoy, Pagos pendientes) estaban **ocultos siempre**. El refactor de la sesión 7 renombró los ids de módulo a inglés, pero las comparaciones vivían dentro de strings (`moduloIds.has("mascotas")`), que el renombrado automático protegía a propósito — así que quedaron comparando contra ids que ya no existían. Ahora comparan contra `pets`, `agenda` y `payments`.

**También se corrigieron fugas de la sesión 7** en los archivos tocados: `"Veterinario"` había quedado como `"Vet"` en un título visible de Horarios, `"Invitaciones pendientes"` como `"Invitaciones pending"`, y varios identificadores locales seguían en español (`semana`, `turno1/turno2`, `objetivo`, `esPendienteDeAprobacion`, …).

**Deuda conocida:** quedan identificadores locales en español dentro de otras pantallas que esta sesión no tocó (`reporteIngresos` en `ClinicalTab`, `propietarioNuevo` en `NewPetDialog`, `crearMedicamento` en `NewMedicationDialog`, etc.). No afectan el contrato ni la UI — son variables privadas de cada archivo — pero contradicen la convención de `docs/GLOSARIO_EN_ES.md` y conviene cerrarlas.

---

## Tarea 00 — Setup del frontend

**Depende de:** nada (puede correr en paralelo a `backend/TASKS.md` Tarea 00).

```
Inicializa el proyecto frontend/ con React + Vite + TypeScript + Tailwind CSS:
1. Scaffold de Vite (plantilla react-ts), Tailwind configurado (tailwind.config,
   postcss.config, directivas en index.css).
2. Cliente HTTP base en src/api/client.ts (fetch o axios) que lea la URL del
   backend desde una variable de entorno VITE_API_URL, adjunte el JWT guardado
   (localStorage) en cada request, y maneje 401 redirigiendo a /login.
3. React Router con rutas: /login y un layout protegido /app/* con sidebar de
   navegación (los ítems del sidebar se llenan en la Tarea 01, según rol).
4. Estructura: src/pages/, src/components/, src/api/.
No implementes pantallas de negocio todavía, solo el andamiaje.
```

---

## Tarea 01 — HU1: Login y layout por rol

**Depende de:** Tarea 00, y de `backend/TASKS.md` Tarea 01 (endpoints de auth).

```
Implementa el frontend de HU1.
Requisitos:
- Pantalla /login: formulario username + password, llama a POST /api/auth/login,
  guarda el JWT recibido, redirige a /app. Si las credenciales son incorrectas,
  muestra el mensaje de error específico devuelto por el backend (sin exponer
  detalles internos).
- Layout de /app: sidebar que muestra solo las opciones habilitadas según el rol
  del JWT decodificado — ADMINISTRADOR ve los 7 módulos (Propietarios, Mascotas,
  Usuarios, Veterinarios, Horarios, Citas, Pagos); VETERINARIO ve
  Mascotas/Citas/Atención Médica; RECEPCIONISTA ve
  Propietarios/Mascotas/Citas/Pagos.
- Pantalla de registro de usuario (para ADMINISTRADOR): formulario con nombre,
  apellidos, ci, username, rol, contraseña + confirmar contraseña, llama a
  POST /api/usuarios.
- Guard de ruta que redirige a /login si no hay JWT válido en localStorage.
```

---

## Tarea 02 — HU2: Registro de Mascotas y Cliente

**Depende de:** Tarea 01, y de `backend/TASKS.md` Tarea 02.

```
Implementa el frontend de HU2.
Requisitos:
- Formulario de registro de mascota + propietario: al ingresar el ci del
  propietario, consulta GET /api/propietarios/buscar?ci=... y, si existe,
  precarga sus datos (readonly, con opción de editar); si no existe, deja los
  campos vacíos para completarlos.
- Al enviar, llama a POST /api/mascotas. Si el backend responde 409 (mascota
  duplicada), muestra el mensaje de error junto al campo, sin perder los datos
  ya ingresados.
- Al completar el registro exitoso, muestra el ID del expediente creado y
  limpia el formulario.
```

---

## Tarea 03 — HU3: Atención Médica

**Depende de:** Tarea 02, y de `backend/TASKS.md` Tarea 03.

```
Implementa el frontend de HU3.
Requisitos:
- Pantalla de búsqueda de mascota por ci del propietario (GET
  /api/mascotas/buscar), que al seleccionar un resultado muestre GET
  /api/mascotas/:id/atenciones como historial médico (ordenado por fecha,
  como ya lo devuelve el backend).
- Formulario de nueva atención: diagnóstico, tratamiento, exámenes externos
  (opcional), monto de consulta. Si el backend responde 400 por campos
  obligatorios faltantes, muestra el error sin perder lo ya escrito.
```

---

## Tarea 04 — HU4: Registrar Pagos

**Depende de:** Tarea 03, y de `backend/TASKS.md` Tarea 04.

```
Implementa el frontend de HU4.
Requisitos:
- Listado de atenciones pendientes de pago por cliente (GET
  /api/pagos/pendientes).
- Formulario de registro de pago: método de pago (Efectivo, Tarjeta,
  Transferencia — QR se agrega en la Tarea 13) y monto. Valida en cliente que
  el monto sea mayor a 0 antes de enviar, y muestra el error del backend si
  igual falla la validación del lado servidor.
- Tras un pago exitoso, quita la atención de la lista de pendientes y muestra
  confirmación.
```

---

## Tarea 05 — HU5: Agendar, Reprogramar y Cancelar Citas

**Depende de:** Tarea 02, y de `backend/TASKS.md` Tarea 05.

```
Implementa el frontend de HU5.
Requisitos:
- Vista de listado de citas (tabla o calendario) con acciones Reprogramar y
  Cancelar por fila.
- Formulario "Nueva Cita": selects de Mascota, Veterinario, Tipo de Consulta,
  Fecha; al elegir fecha + veterinario, consulta GET /api/citas/disponibilidad
  y solo muestra/habilita los horarios libres.
- Si el backend responde 409 (conflicto de horario) al confirmar, muestra el
  error y refresca la disponibilidad.
- Reprogramar reabre el formulario precargado con los datos de la cita.
```

---

## Tarea 06 — HU6: Control de Vacunación y Desparasitación

**Depende de:** Tarea 02, y de `backend/TASKS.md` Tarea 06.

```
Implementa el frontend de HU6.
Requisitos:
- Formulario de registro de vacuna/desparasitación desde la ficha de una
  mascota (tipo, fecha de aplicación, próxima dosis).
- Vista de historial preventivo por mascota, marcando visualmente (badge rojo)
  los controles con `vencido: true`.
- Panel "Próximos a vencer" (GET /api/controles-preventivos/proximos-a-vencer),
  accesible desde el menú de Administrador/Veterinario, ordenado por fecha.
```

---

## Tarea 07 — HU7: Reporte de Ingresos Económicos

**Depende de:** Tarea 04, y de `backend/TASKS.md` Tarea 07. Solo visible para rol ADMINISTRADOR.

```
Implementa el frontend de HU7.
Requisitos:
- Formulario de filtros: rango de fechas y tipo de servicio.
- Tabla de resultados + fila de totales (cantidad de pagos, monto total),
  alimentada por GET /api/reportes/ingresos.
- Si un usuario sin rol ADMINISTRADOR llega a esta ruta por URL directa,
  redirige con un mensaje de acceso restringido (el backend ya devuelve 403;
  el frontend solo debe manejarlo con una redirección amigable, no confiar
  únicamente en ocultar el ítem del menú).
```

---

## Tarea 08 — HU8: Reportes Clínicos y Administrativos

**Depende de:** Tarea 07, y de `backend/TASKS.md` Tarea 08.

```
Implementa el frontend de HU8.
Requisitos:
- Selector de tipo de reporte + rango de fechas, consumiendo GET /api/reportes.
- Gráfico (Recharts) de ingresos por tipo de servicio con los datos devueltos.
- Botones "Exportar PDF" y "Exportar Excel" que disparen la descarga de
  GET /api/reportes/export/pdf y /export/excel respectivamente.
```

---

## Tarea 09 — HU9: Gestión de Inventario de Medicamentos

**Depende de:** Tarea 03, y de `backend/TASKS.md` Tarea 09.

```
Implementa el frontend de HU9.
Requisitos:
- Listado de medicamentos con stock actual/mínimo, y formulario de "Registrar
  entrada" (POST /api/medicamentos/:id/entradas).
- Alerta visible (banner o badge) cuando GET /api/medicamentos/bajo-stock
  devuelve resultados, visible al entrar al módulo.
- En el formulario de nueva atención (Tarea 03), agrega un selector opcional de
  medicamentos usados con cantidad, para enviarlos junto con la atención.
```

---

## Tarea 11 (opcional) — HU11 Track A: Panel de recordatorios WhatsApp

**Depende de:** Tarea 05, Tarea 06, y de `backend/TASKS.md` Tarea 11.

```
Implementa el frontend del Track A de HU11.
Requisitos:
- Panel "Recordatorios de hoy" (GET /api/recordatorios/pendientes) con un botón
  por fila que abra `https://wa.me/<telefono>?text=<mensaje codificado>` en una
  pestaña nueva.
- Botón "Marcar como enviado" junto a cada fila que llame a POST
  /api/recordatorios/:id/marcar-enviado y la quite de la lista.
```

---

## Tarea 12 (opcional) — HU11 Track B: Panel de entregabilidad

**Depende de:** `backend/TASKS.md` Tarea 12.

```
Implementa un panel simple (rol ADMINISTRADOR) que muestre la tasa de
entregabilidad de notificaciones de los últimos 30 días, consumiendo GET
/api/notificaciones/metricas, y una alerta visual si el conteo mensual de
WhatsApp se acerca al límite gratuito configurado.
```

---

## Tarea 13 (opcional) — HU12: Pago por QR

**Depende de:** Tarea 04, y de `backend/TASKS.md` Tarea 13.

```
Agrega "QR" como opción en el select de método de pago del formulario de la
Tarea 04, y como opción de filtro en el reporte de ingresos de la Tarea 07.
```

---

## Tarea 14 (opcional) — HU13: Importación desde Excel

**Depende de:** Tarea 02, y de `backend/TASKS.md` Tarea 14.

```
Implementa el frontend de HU13.
Requisitos:
- Pantalla de carga de archivo .xlsx que llame a POST
  /api/importaciones/clientes.
- Tras procesar, muestra una tabla con el resumen: filas importadas
  correctamente vs. filas con error (número de fila + motivo).
```

---

## Tarea 15 (opcional) — HU14: PWA instalable

**Depende de:** Tarea 00.

```
Convierte el frontend en una PWA instalable usando `vite-plugin-pwa`.
Requisitos:
- Configura manifest (nombre, ícono, color de tema) y service worker en modo
  `autoUpdate`.
- Verifica que el navegador ofrezca el prompt de "Agregar a pantalla de inicio"
  en dispositivos compatibles.
- Al abrir sin conexión, muestra una pantalla simple de aviso ("Sin conexión,
  intenta de nuevo") en vez de una pantalla en blanco.
```

---

## Tarea 16 (opcional) — HU15: Exportación completa de datos

**Depende de:** `backend/TASKS.md` Tarea 15.

```
Agrega un botón "Exportar todos mis datos" en el panel de administración (rol
ADMINISTRADOR) que llame a GET /api/exportacion/completa, con indicador de
progreso mientras se genera y descarga el archivo.
```
