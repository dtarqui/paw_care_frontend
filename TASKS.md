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

## Correcciones y mejoras (sesión 9 — rediseño del login y credenciales demo por rol)

El login es la primera pantalla que ve cualquiera, así que se rehizo con eso en mente.

- [x] **Layout partido en dos columnas** (`LoginPage.tsx`) — panel de marca a la izquierda sobre `bg-primary` (logo, propuesta de valor y tres capacidades reales: historial clínico, agenda y recordatorios, inventario y reportes) y formulario a la derecha. Por debajo de `lg` el panel desaparece y lo reemplaza una cabecera compacta, para no robarle espacio al formulario en móvil. Usa solo tokens de tema, así que funciona igual en claro/oscuro y con los tres acentos de color.
- [x] **Componente `Tooltip` nuevo** (`components/ui/tooltip.tsx`) — no existía en el proyecto; se agregó sobre el paquete `radix-ui` que ya era dependencia, siguiendo el mismo patrón de los demás componentes de `ui/`.
- [x] **Tooltips donde aportan**, no decorativos: en "Usuario" (aclara que no es el correo, es el username que asigna el Administrador), en mostrar/ocultar contraseña, en "Solicita tu acceso" (avisa que un Admin debe aprobar la cuenta) y en cada cuenta de demostración (qué ve ese rol).
- [x] **Aviso de Bloq Mayús** — detectado con `getModifierState("CapsLock")` en el campo de contraseña. Es la causa más común de un login fallido; avisarla antes ahorra el intento perdido.
- [x] **Una credencial demo por rol, y clicable** — el bloque de demo mostraba solo `admin` y `recepcion`; faltaba Veterinario porque su username cambiaba en cada reseed (nota de sesión 4). Ahora `prisma/seed.ts` siembra un `veterinario` / `vet123` estable (Patricia Mendoza), y las tres filas son botones que llenan el formulario de un clic — pensado para cambiar de rol en vivo durante una demo sin tipear. Los otros 5 veterinarios siguen existiendo como datos, pero no se publicitan.
- [x] **Estados de error y envío más claros** — el error va en una caja con ícono y borde, y el botón pasa a "Verificando…" con spinner mientras envía.

**Fugas de la sesión 7 corregidas acá:** la etiqueta del campo decía **"User"** en vez de "Usuario", y el enlace de registro decía **"¿Eres vet y no tienes cuenta?"** en vez de "¿Eres veterinario…?". Ambas venían del renombrado automático, que alcanzó texto JSX sin comillas.

---

## Correcciones y mejoras (sesión 10 — tablas en móvil, estados compartidos y KPIs por pantalla)

Tres mejoras transversales de UI, decididas tras auditar las 9 pantallas con tabla.

- [x] **Fallback de tarjetas en móvil para las tablas** (`components/MobileCard.tsx`) — la app llegaba a 12 columnas en Pagos y 11 en Reportes clínicos; en un celular eso era scroll horizontal con 3 columnas visibles, en una PWA instalable pensada para el mostrador. Ahora cada listado muestra `<MobileCard>` por debajo de `md` y la `<Table>` de ahí para arriba. Aplicado en **8 de 9 tablas** (la novena son 3 columnas dentro de un diálogo de importación, no lo necesita): Pagos (pendientes e historial), Mascotas, Propietarios, Usuarios, Inventario, Auditoría, Reportes → Ingresos y Reportes → Clínicos.
- [x] **`EmptyState` y `TableSkeleton` compartidos** (`components/EmptyState.tsx`, `components/TableSkeleton.tsx`) — el bloque de estado vacío estaba copiado en **10 archivos** y el skeleton de carga en **17**, cada uno con su espaciado. Ahora quedan **0** copias de estado vacío y solo 2 usos sueltos de `Skeleton` legítimos (chips de horarios disponibles y tarjetas del dashboard, que no son tablas). `EmptyState` acepta una `action`: donde el vacío se resuelve desde la misma pantalla (Mascotas, Inventario, Usuarios) el botón de alta va dentro del estado vacío, así una instalación nueva indica el siguiente paso en vez de ser un callejón sin salida.
- [x] **KPIs contextuales en los listados** — `StatTile` existía pero solo lo usaba el Dashboard. Ahora Pagos abre con el total pendiente en Bs. y cuántas atenciones lo componen; Inventario con el catálogo y cuántos están bajo el mínimo; Propietarios con cuántos clientes y cuántas mascotas cubren. Responden la pregunta principal de cada pantalla sin leer la tabla.
- [x] **Números tabulares** (`tabular-nums`) en montos, stock y pesos — pasó de 1 archivo a 6. Sin esto las columnas de dinero no alinean por dígito, que es lo que hace que una tabla de pagos se vea descuidada.

**Bugs visibles corregidos, todos residuo del renombrado de la sesión 7:**

- **El método de pago se mostraba crudo** ("CASH", "CARD", "TRANSFER") en "Últimos pagos": el mapa `METODO_LABEL` había quedado con las claves del enum viejo. Se eliminó y ahora usa `StatusBadge`, que ya traduce y colorea los métodos.
- **24 etiquetas visibles en inglés**: encabezados de tabla ("Pet", "Owner", "Medication", "Role", "User"), botones ("Registrar payment", "Registrar pet", "Invitar vet", "Editar owner", "Editar medication") y frases ("Atenciones pending de cobro", "Últimos sent", "Aún no hay visits registradas", "medication(s) con stock bajo", "Sin controls preventivos", "recordatorios pending").

**Por qué se escaparon antes:** la auditoría de la sesión 7 solo marcaba una palabra inglesa si estaba rodeada de palabras funcionales del español, así que no veía etiquetas de una sola palabra como `<TableHead>Pet</TableHead>`. Se agregó un segundo barrido específico para textos cortos (encabezados, labels, `placeholder`, `aria-label`).

---

## Correcciones y mejoras (sesión 11 — búsqueda global, paleta de gráficos accesible y breadcrumbs)

Los tres ítems que la sesión 10 había dejado pendientes.

### Búsqueda global (Ctrl/Cmd + K)

- [x] **Endpoint nuevo `GET /api/search?q=`** (`requireAuth`) — los endpoints existentes solo buscaban por CI exacto, así que combinarlos no alcanzaba: hacía falta coincidencia parcial por nombre.
- [x] **Diseñado con proveedores, no con un `if` por entidad** — `SearchProvider` (`backend/src/services/search/searchProvider.ts`) define el contrato; `pet.searchProvider.ts` y `owner.searchProvider.ts` lo implementan y `search.service.ts` los compone. Sumar medicamentos o citas a la búsqueda es escribir un proveedor más y registrarlo: el servicio, el controlador y la ruta no cambian. Cada proveedor decide cómo se representa su entidad (título, subtítulo y a qué ruta navega), así que quien consume la búsqueda solo conoce `SearchResult`.
- [x] **Mascotas por nombre; propietarios por nombre, apellido o CI** — las tres formas en que recepción identifica a un cliente en el mostrador. Solo mascotas activas: una dada de baja no es un destino útil al que saltar.
- [x] **Paleta de comandos en el frontend** (`components/GlobalSearch.tsx`) sin dependencias nuevas — está construida sobre el `Dialog` que ya existía, no sobre `cmdk`. Debounce de 250 ms, mínimo de 2 caracteres (mismo umbral que aplica el backend), navegación con flechas y Enter, resultados agrupados por tipo.
- [x] **Un registro `RESULT_KINDS` traduce `type` a ícono y etiqueta** — el diálogo no conoce mascotas ni propietarios; cuando el backend sume un proveedor, acá va una entrada más.
- [x] **Con disparador visible**, no solo el atajo: un botón "Buscar… Ctrl K" arriba del sidebar y un ícono de lupa en la cabecera móvil. Un atajo que nadie descubre no sirve.

### Paleta de gráficos accesible

- [x] **La paleta anterior fallaba tres de los cinco checks** del validador de la skill `dataviz`, medido contra las superficies reales de la app. En claro: banda de luminosidad, separación CVD (peor par ΔE 5.8 con protanopía) y piso de visión normal (ΔE 14.4). En **oscuro era peor**: `chart-1` y `chart-2` estaban a ΔE 8.7 en visión normal y **2.3 con protanopía** — dos series contiguas prácticamente idénticas.
- [x] **Reemplazada por la paleta de referencia validada** (azul, naranja, aqua, amarillo, magenta), re-escalonada para la superficie oscura — no es un flip automático del modo claro. Ambos modos pasan los cinco checks. Se dejan en hex a propósito: es el valor exacto que pasó la validación, sin deriva por conversión desde oklch.
- [x] **El orden de los slots es el mecanismo de seguridad CVD**, no decoración: está documentado en `index.css` que no se reordene ni se agregue un 6º color sin volver a correr el validador.
- [x] **Los gráficos ahora usan `--chart-1`, no `--primary`** — el acento de marca rota con el tema de color (violeta/océano/rosa) y nunca se validó como marca contra la superficie del gráfico; el slot 1 sí (≥3:1 en ambos modos). Se confirmó contra la skill que **un color para todas las barras es lo correcto** en el gráfico de ingresos por servicio: colorear cada barra distinto codificaría el rango, que es justo lo que el largo de la barra ya muestra.

### Breadcrumbs

- [x] **`components/Breadcrumbs.tsx`** y aplicado en la ficha de mascota, que es la única pantalla profunda: se llega desde Mascotas y desde Propietarios, y antes solo tenía un "Volver a Mascotas" que apuntaba siempre al mismo lugar sin importar de dónde vinieras.

---

## Correcciones y mejoras (sesión 12 — pantalla de Información / manual de uso)

- [x] **Pantalla «Información» (`/app/info`)** — manual de uso para el personal de la clínica, visible para los tres roles desde el grupo «Sistema». **No documenta arquitectura ni código a propósito**: la audiencia es quien usa el sistema, no quien lo mantiene.
- [x] **14 secciones con índice lateral** — primeros pasos, qué hace cada rol, el día a día, clientes y mascotas, agenda, atención médica, vacunas y desparasitación, cobros, recordatorios, inventario, reportes, cuentas del personal, tu cuenta y preguntas frecuentes. El índice queda fijo al costado en escritorio y colapsa en móvil.
- [x] **Explicado con diagramas, no con muros de texto** (`pages/info/InfoBlocks.tsx`): `FlowDiagram` para el recorrido Cliente → Mascota → Cita → Atención → Cobro (horizontal en escritorio, apilado en móvil), `RoleMatrix` para qué módulo ve cada rol, `StateFlow` para el ciclo de una cita (Confirmada → Atendida | Cancelada), más `Steps`, `Callout` y `Faq`. Los bloques no conocen el contenido: agregar una sección es escribir texto.
- [x] **Contenido verificado contra el comportamiento real**, no redactado de memoria: los 30 días de «próximos a vencer», las 24 h / 7 días de los recordatorios, los campos obligatorios de cada formulario, el mínimo de 6 caracteres de contraseña y las 8 horas de sesión salen de leer el código.
- [x] **Documenta también los límites**, que es lo que evita sorpresas en una demostración: el botón «Cobrar con QR» todavía no cobra (falta conectar el banco) y explica la alternativa; los recordatorios son manuales; los correos dependen de que la clínica configure el envío.

**Corrección durante la escritura:** el borrador afirmaba que nadie puede entrar a un módulo ajeno «ni escribiendo la dirección a mano». Al verificarlo resultó falso — las rutas del frontend están protegidas por sesión (`ProtectedRoute`) pero **no por rol**, así que la pantalla sí abre; lo que la protege es que la API responde 403 y no entrega datos. La sección se reescribió para decir exactamente eso.

**Brecha menor detectada, no corregida:** si alguien navega a mano a un módulo que no le corresponde (ej. Recepción a `/app/users`), ve la pantalla armada con un error de carga en vez de un «no tienes permiso» claro. Los datos están protegidos, pero la experiencia es confusa. Se arregla con una guarda de rol en las rutas del frontend.

---

## Correcciones y mejoras (sesión 13 — auditoría completa inglés/español)

Barrido de las dos mitades de la convención (`docs/GLOSARIO_EN_ES.md`): que **nada** en pantalla quede en inglés y que **ningún** identificador quede en español. Se hizo con un enmascarador de strings, comentarios y texto JSX, para poder renombrar código sin tocar una sola palabra de las que lee el usuario.

**Inglés que quedaba a la vista (corregido):**

- `"Solo mis appointments"` → «Solo mis citas»; `"Guardar schedule"` → «Guardar horarios»; `"Importar clientes from Excel"` → «desde Excel»; `"Datos profesionales (solo Vet)"` → «(solo Veterinario)»; `"Te invitaron a PawCare como Vet"` → «como Veterinario».
- `"Dashboard"` en el sidebar y en el manual → «Inicio», que es como se llama la pantalla en todos los demás lugares.
- El badge de stock decía `OK` → «Suficiente». El diálogo de borrado hablaba de «consumos en visits» → «en atenciones».
- La lista de columnas del importador de Excel mostraba las claves camelCase del backend (`apellidoPaterno`, `mascotaEspecie`) — ahora describe el orden esperado en español legible.
- Tres textos en voseo rioplatense («Probá», «revisá») pasados a la forma que usa el resto de la app.

**Identificadores en español (renombrados, 0 restantes):** ~670 referencias en 38 archivos. Estado y variables (`busqueda`→`search`, `monto`→`amount`, `mostrarPassword`→`showPassword`, `rol`→`role`), mutaciones (`crearMascota`→`createPetMutation`, `marcarEnviado`→`markSentMutation`), funciones (`formatearFecha`→`formatDate`, `limpiarYCerrar`→`resetAndClose`, `agruparPorDia`→`groupByDay`), tipos y props (`CitasListaTabProps`→`AppointmentsListTabProps`, `FranjaHoraria`→`TimeSlotPicker`, `onReprogramar`→`onReschedule`, `pendiente`→`pendingPayment`) y constantes (`TIPO_LABEL`→`CONTROL_TYPE_LABEL`, `OPCIONES_TEMA`→`THEME_OPTIONS`, `ESTADO_INICIAL`→`INITIAL_STATE`). Cierra la deuda que la sesión 8 había dejado anotada.

**Cómo se hizo sin romper el español:** un primer intento renombró con una máscara ingenua y corrompió `useState<string>(…)` (el `>` del genérico parecía el fin de una etiqueta JSX). Se descartó por completo — `git checkout`, no parches — y se rehízo con una máscara por carácter que entiende template literals (`${…}` vuelve a ser código), comentarios y texto JSX real. La red de seguridad fue `tsc -b` + `oxlint` + `vite build` después de cada pasada.

---

## Correcciones y mejoras (sesión 14 — español e inglés con i18next)

La app pasa a tener **dos idiomas: español (base) e inglés**, a elección de cada persona. Se hizo con `i18next` + `react-i18next` + `i18next-browser-languagedetector`, y obligó a sacar de los componentes hasta el último texto visible.

### Lo que se encontró de paso

- **`Confirmar payment` y `Registrar User`** seguían en espanglish. El barrido de la sesión 13 no los vio: su detector de texto JSX solo miraba lo que venía **después de un `>`**, y estos venían después de una llave (`{spinner}Confirmar payment`). Se corrigió el detector y se rehizo la auditoría — esta vez sí aparecieron.
- **El eje X del gráfico de peso estaba vacío.** El renombrado de la sesión 13 cambió la propiedad del dato a `label`, pero el `dataKey="etiqueta"` de Recharts vivía dentro de un string y quedó protegido: apuntaba a una propiedad que ya no existe.
- **Exportar el reporte de ingresos descargaba el de atenciones.** `ClinicalTab` mandaba `"ingresos-por-servicio"` al backend, que solo entiende `revenue-by-service` y caía a su default. Se alinearon los identificadores con el contrato real de la API.
- **Cobrar por QR no refrescaba la lista de pagos**: invalidaba `["pagos", "pendientes"]`, claves que dejaron de existir en la sesión 7. Ahora invalida `["payments"]`, que por prefijo cubre pendientes e historial.

### Cómo quedó

- [x] **668 claves por idioma** en `src/i18n/locales/es.json` y `en.json`, con el mismo conjunto exacto en los dos. Un script de verificación compara ambos archivos y busca `t("clave")` sin destino.
- [x] **Selector de idioma en Configuración**, junto a tema y color, y un toggle compacto **ES | EN** en las pantallas públicas (login, invitación, recuperar contraseña): quien recibe una invitación por correo tiene que poder leer el formulario antes de tener cuenta. La elección se guarda en `localStorage` y el `<html lang>` la sigue.
- [x] **Plurales de verdad**, no `n === 1 ? "mes" : "meses"` escrito a mano: `pets.age.month_one/_other`, `appointments.count_*`, `inventory.lowStockWarning_*`, `imports.importedCount_*`. `calculateAge` dejó de devolver texto armado y ahora devuelve `{ unit, count }` para que el plural lo resuelva i18next.
- [x] **Fechas por idioma** (`lib/date.ts` + `useFormatters`): en español el `dd/mm/aaaa` de siempre; en inglés el mes abreviado (`04 Mar 2026`), porque `03/04` significa cosas distintas según el país y en una ficha clínica esa ambigüedad no es aceptable. De paso se borraron **13 copias** de `formatDate` repartidas por las pantallas.
- [x] **El menú y los módulos siguen viniendo del backend**, pero el texto lo pone el frontend (`features/dashboard/labels.ts`): traduce por id de módulo, con variante por rol donde la descripción cambia (la Agenda de un Veterinario es «tus citas»; la de Recepción, «agendar y reprogramar»), y cae al texto en español del servidor si falta la clave.
- [x] **El manual de `/app/info` pasó a ser contenido, no JSX.** Las 14 secciones viven en `info.*` de los archivos de traducción y la página las recorre; el énfasis se escribe `**así**` y lo resuelve un `RichText` de 15 líneas. La página bajó de 589 a 180 líneas y agregar una sección es escribir texto en dos archivos.
- [x] **Los slugs del tema de color pasaron a inglés** (`violeta|oceano|rosa` → `violet|ocean|pink`) en el CSS, el contexto y el script sin bloqueo de `index.html`, con un mapa de compatibilidad que traduce el valor viejo al leerlo: a nadie se le resetea el acento que ya tenía elegido.

**Lo que se queda en español a propósito**, y así lo explica el propio manual: los datos que carga la clínica (nombres, razas, diagnósticos), el catálogo `SERVICE_TYPES` guardado en la base, el texto de los recordatorios de WhatsApp (lo lee el cliente, no el personal) y el `details` de la auditoría, que es un registro histórico y no una etiqueta.

---

## Correcciones y mejoras (sesión 15 — responsive medido, de 320px a 1440px)

Revisión completa del frontend en pantallas reales. Se armó un script con Playwright que carga las 17 rutas a **320, 375, 430, 768, 1024 y 1440px**, saca captura y mide el desborde horizontal de la página junto con el elemento que lo provoca (ignorando lo que ya recorta un contenedor con scroll propio). También abre los diálogos y las vistas detrás de pestañas, que no salen en una captura de página.

### El peor caso no era el celular: era la tablet

- [x] **El corte tarjetas/tabla pasó de `md` (768px) a `lg` (1024px).** Medido: a 768px la tabla de Usuarios dejaba **Estado y Acciones fuera de la pantalla** y la de Pagos perdía el monto y el botón «Registrar pago». La `<Table>` de shadcn scrollea por dentro, así que no había desborde de página que delatara nada — la pantalla simplemente se veía incompleta.
- [x] **El shell cambia en `lg` también**: por debajo, el sidebar va en el panel lateral desplegable. Un sidebar fijo de 256px sobre 768px dejaba 512px de contenido, y con eso no entran ni las tablas ni los formularios.
- [x] **`MobileCardList` pasó a ser grilla**: entre `md` y `lg` —tablet en vertical, ya sin sidebar— van dos tarjetas por fila, en vez de una sola estirada con la etiqueta y el valor separados por medio ancho de pantalla.

### Formularios y cabeceras

- [x] **19 grillas `grid-cols-2` sin punto de corte** ponían dos campos por fila también en un teléfono de 360px. Ahora son `grid-cols-1 sm:grid-cols-2` — y los hijos `col-span-2` pasaron a `col-span-1 sm:col-span-2`, porque en una grilla de una columna generaban una segunda columna fantasma.
- [x] **Cabeceras de pantalla y de tarjeta apiladas en celular**: título + botones en una fila fija dejaba el subtítulo de Mascotas partido en tres líneas y, en Configuración, el botón «Cambiar contraseña» **cortado contra el borde de la tarjeta**.
- [x] **Buscadores y selectores de ancho fijo** (`w-56`, `w-64`) ahora ocupan todo el ancho en celular y recuperan su medida de `sm` para arriba.
- [x] **Las pestañas pueden scrollear** dentro de su ancho: tres pestañas no entran en un teléfono angosto.

### La grilla semanal de horarios

- [x] Cada turno ocupa su propia fila en celular, con su nombre (**Mañana** / **Tarde**) arriba de los campos: apilados sin etiqueta no había forma de saber cuál era cuál.
- [x] **Los campos de hora cortaban el «AM/PM» también en escritorio** — `w-28` no alcanza para un `<input type="time">` de 12 horas con su ícono. Pasaron a `w-36`.

### Dos bugs encontrados de paso

- **La matriz de permisos del manual afirmaba que todos los roles pueden todo.** Al mover el manual a los archivos de traducción (sesión 14), react-i18next devolvía los booleanos como texto, y `"false"` es verdadero. Los permisos volvieron al código (`ROLE_MATRIX` en `InfoPage.tsx`), que es donde corresponde: son un hecho del sistema, espejo de `dashboard.service.ts`, no prosa traducible. En las traducciones quedaron solo las etiquetas de área.
- **El gráfico de ingresos por servicio mostraba las categorías sin traducir**: Recharts pinta el dato crudo, así que el eje seguía en español con la interfaz en inglés. Ahora se traduce antes de pasárselo, y el eje se angosta en celular (150px de eje se comían la mitad del ancho útil).

Además, la matriz de permisos **deja de ser tabla en celular**: cuatro columnas en 320px encimaban los encabezados. Ahí va como lista, un módulo por fila con los roles que sí tienen acceso.

**Resultado:** cero desborde horizontal en las 17 rutas × 6 anchos, más los diálogos y las vistas con pestañas, con `tsc`, `oxlint` y `vite build` en verde.

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
