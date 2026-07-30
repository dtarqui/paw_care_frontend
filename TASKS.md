# Frontend — Cola de tareas para construcción

> Extraído de `docs/PLAN_PROYECTO_PAWCARE.md` (referencia, no editar desde aquí). Cada tarea es un prompt autocontenido, en orden de ejecución, numerado para alinear con `backend/TASKS.md`. El estilo visual de referencia está en `../docs/images/17-*.png` a `23-*.png` (header con gradiente, tarjetas, tablas) — es guía de UX, no código a copiar.

**Stack:** React + Vite + TypeScript + Tailwind CSS, consumiendo el backend por API REST.

**Definition of Done por tarea:** pantalla(s) implementadas · consume los endpoints reales de la tarea equivalente en `backend/TASKS.md` (no datos mockeados permanentes) · maneja estados de error/validación descritos en los criterios de aceptación · responsive (funciona en escritorio, tablet y móvil, principio de diseño del proyecto).

---

## Progreso

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

**Gestión de Horarios** (turnos semanales de cada veterinario, mencionada en HU1) sigue sin tarea propia — el alta de Veterinario (matrícula/especialidad) ya vive dentro de Gestión de Usuarios, pero definir sus horarios de atención para HU5 queda pendiente.

*(HU10 — Alertas Automáticas — es el job de backend detrás de la Tarea 11; no tiene pantalla propia.)*

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
