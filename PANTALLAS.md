# Pantallas del Frontend — PawCare

> Arquitectura de información y wireframes **abstractos** (zonas y funcionalidad, no diseño visual) para cada pantalla. Sirve de referencia al ejecutar `frontend/TASKS.md`. El estilo visual final (colores, tipografía) se inspira en el prototipo de referencia (`../docs/images/17-*.png` a `23-*.png`), pero eso es un tema de diseño, no de esta documentación.

---

## 1. Mapa de navegación por rol

```
                              /login
                                │
                                ▼
                          /app (shell)
                                │
        ┌───────────────┬──────┼──────┬───────────────┐
        ▼                ▼            ▼                ▼
  ADMINISTRADOR      VETERINARIO  RECEPCIONISTA    (Dueño de mascota:
  (7 módulos +        (Mascotas,   (Propietarios,    fuera del MVP,
   reportes +          Citas,       Mascotas,         ver sección 8)
   inventario)         Atención     Citas, Pagos)
                        Médica,
                        Control
                        Preventivo)
```

| Rol | Ve en el sidebar |
|---|---|
| **Administrador** | Dashboard, Propietarios, Mascotas, Usuarios, Veterinarios, Citas, Pagos, Control Preventivo, Inventario, Reportes (Ingresos, Clínicos), Configuración |
| **Veterinario** | Dashboard, Mascotas, Atención Médica, Citas, Control Preventivo |
| **Recepcionista** | Dashboard, Propietarios, Mascotas, Citas, Pagos |

El sidebar no es una lista fija: se arma en el frontend filtrando este mapa según el rol embebido en el JWT (Tarea 01 de `TASKS.md`).

---

## 2. Shell de la aplicación

Todas las pantallas autenticadas comparten este esqueleto:

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER   [PawCare]                    [Nombre · Rol]  [Cerrar sesión] │
├───────────┬──────────────────────────────────────────────────────┤
│           │                                                      │
│  SIDEBAR  │                    CONTENIDO                         │
│  (según   │        (la pantalla activa se dibuja aquí)             │
│   rol)    │                                                      │
│           │                                                      │
│           │                                                      │
└───────────┴──────────────────────────────────────────────────────┘
```

**Mobile (< 768px):** el sidebar se colapsa detrás de un botón de menú (hamburguesa) en el header; el contenido pasa a ocupar el ancho completo. Ninguna pantalla asume que el sidebar está siempre visible.

---

## 3. Patrones de pantalla reutilizables

La mayoría de las pantallas son variaciones de **5 patrones**. Se definen una vez aquí; el detalle por pantalla (sección 5) solo indica qué patrón usa y qué le cambia.

### Patrón A — Lista + Formulario (CRUD)
Usado por: Propietarios, Mascotas, Usuarios, Veterinarios, Medicamentos.

```
┌─ Título del módulo ───────────────────────────  [+ Nuevo] ─┐
│ ┌─ Buscar/Filtrar ────────────────────────────────────────┐│
│ └───────────────────────────────────────────────────────┘│
│ ┌─ Tabla ───────────────────────────────────────────────┐│
│ │ col A │ col B │ col C │ ... │ Editar │ Eliminar        ││
│ │───────┼───────┼───────┼─────┼────────┼─────────────────││
│ │  ...filas...                                            ││
│ └───────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

"+ Nuevo" o "Editar" abren:
┌─ Formulario (modal o panel lateral) ─────────────────────┐
│  Campo 1              Campo 2                             │
│  Campo 3              Campo 4                              │
│  ...                                                       │
│                          [Guardar]   [Cancelar]             │
└─────────────────────────────────────────────────────────────┘
```

### Patrón B — Búsqueda + Detalle
Usado por: Atención Médica (búsqueda de mascota → historial).

```
┌─ Búsqueda ────────────────────────────────────────────────┐
│  Buscar por CI del propietario: [____________] [Buscar]    │
│  Resultados: ( Mascota 1 )( Mascota 2 )( Mascota 3 )        │
└────────────────────────────────────────────────────────────┘
┌─ Detalle de la mascota seleccionada ─────────────────────────┐
│  Nombre · especie · raza · propietario                        │
│  ┌─ Historial ─────────────────────────────────  [+ Nueva] ─┐│
│  │ Fecha │ Diagnóstico │ Tratamiento │ Monto │ Estado pago  ││
│  └────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### Patrón C — Dashboard de tarjetas
Usado por: Home / pantalla de bienvenida tras el login.

```
┌─ Bienvenida ───────────────────────────────────────────────┐
│  Hola, {nombre} — sesión iniciada como {rol}                │
└────────────────────────────────────────────────────────────┘
┌ Tarjeta ┐ ┌ Tarjeta ┐ ┌ Tarjeta ┐ ┌ Tarjeta ┐
│ Módulo  │ │ Módulo  │ │ Módulo  │ │ Módulo  │   (una por módulo
│  A      │ │  B      │ │  C      │ │  D      │    habilitado para
└─────────┘ └─────────┘ └─────────┘ └─────────┘    el rol activo)
```

### Patrón D — Filtros + Resultado (reportes)
Usado por: Reporte de Ingresos, Reportes Clínicos.

```
┌─ Filtros ────────────────────────────────────────────────┐
│ Desde [fecha]  Hasta [fecha]  Tipo [▾]        [Generar]   │
└──────────────────────────────────────────────────────────┘
┌─ Resultado ──────────────────────────────────────────────┐
│  Totales: cantidad = N   monto = $X                        │
│  [ gráfico ]                    [Exportar PDF][Exportar Excel]│
│  ┌─ Tabla de detalle ──────────────────────────────────┐  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Patrón E — Agenda con pestañas
Usado por: Citas (único módulo con layout propio). La "Lista" es una **agenda agrupada por día** (no una tabla plana) — más fácil de escanear que filas sueltas mezclando fechas.

```
┌─ Pestañas: [ Lista de Citas ] [ Nueva Cita ] ───────────────────┐
├─ Lista ────────────────────────────────────────────────────────┐
│ (Veterinario) [ toggle: Solo mis citas ]                        │
│ ┌─ Hoy · N citas ────────────────────────────────────────────┐ │
│ │ 09:00  Mascota (especie)         Veterinario · Tipo  [Estado] [Acciones] │
│ │ 09:30  ...                                                    │ │
│ └───────────────────────────────────────────────────────────┘ │
│ ┌─ Mañana · N citas ─────────────────────────────────────────┐ │
│ │ ...                                                          │ │
│ └───────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
├─ Nueva Cita ─────────────────────────────────────────────────┐
│ Mascota[▾]  Veterinario[▾ o bloqueado si rol=Veterinario]  Tipo[▾]  Fecha[📅] │
│ Horarios disponibles — agrupados:                              │
│   🌅 Mañana:  (08:00)(08:30)(09:00)...                          │
│   🌇 Tarde:   (14:00)(14:30)...                                 │
│ Motivo: [________________________]                             │
│ (resumen: "Vas a agendar {mascota} con {vet} el {fecha} a las {hora}") │
│                                              [Agendar cita]      │
└────────────────────────────────────────────────────────────────┘
```

**Restricción de negocio:** si el rol autenticado es `VETERINARIO`, el campo "Veterinario" no es un select — se auto-completa con su propio registro (vía `Veterinario.usuarioId`) y se muestra bloqueado con un badge "Tú". Administrador y Recepcionista sí ven el select completo y pueden agendar para cualquier veterinario. Se valida también en el backend (403 si un Veterinario intenta forzar otro `veterinarioId`), no solo se oculta en la UI.

---

## 4. Mapa de pantallas

| ID | Pantalla | Ruta | Rol(es) | Patrón | HU / Tarea |
|---|---|---|---|---|---|
| P00 | Login | `/login` | todos | formulario simple | HU1 · Tarea 01 |
| P01 | Dashboard | `/app` | todos | C | HU1 · Tarea 01 |
| P02 | Gestión de Usuarios | `/app/usuarios` | Administrador | A (extendido) | HU1 · Tarea 01 |
| P03 | Gestión de Propietarios | `/app/propietarios` | Admin, Recepcionista | A | HU2 · Tarea 02 |
| P04 | Gestión de Mascotas | `/app/mascotas` | Admin, Veterinario, Recepcionista | A | HU2 · Tarea 02 |
| P05 | Atención Médica | `/app/atenciones` | Veterinario, Admin | B | HU3 · Tarea 03 |
| P06 | Gestión de Pagos | `/app/pagos` | Admin, Recepcionista | A (variante: sin edición, solo alta) | HU4 · Tarea 04 |
| P07 | Gestión de Citas | `/app/citas` | Admin, Veterinario, Recepcionista | E | HU5 · Tarea 05 |
| P08 | Control Preventivo | `/app/control-preventivo` | Veterinario, Admin | A + panel de vencimientos | HU6 · Tarea 06 |
| P09 | Reporte de Ingresos | `/app/reportes/ingresos` | Administrador | D | HU7 · Tarea 07 |
| P10 | Reportes Clínicos | `/app/reportes/clinicos` | Administrador | D | HU8 · Tarea 08 |
| P11 | Gestión de Inventario | `/app/inventario` | Administrador | A + alerta | HU9 · Tarea 09 |
| P12 (opc.) | Recordatorios WhatsApp | `/app/recordatorios` | Recepcionista, Admin | lista de acciones | HU11-A · Tarea 11 |
| P13 (opc.) | Importar clientes | `/app/importar` | Administrador | carga de archivo + resumen | HU13 · Tarea 14 |
| P14 (opc.) | Configuración | `/app/configuracion` | Administrador | widgets | HU11-B, HU15 · Tareas 12 y 16 |
| P15 | Ficha de Mascota | `/app/mascotas/:id` | Admin, Veterinario, Recepcionista | B (detalle) + historial unificado | Gap cerrado (sesión posterior) |
| P16 | Horarios de Veterinario | `/app/horarios` | Administrador, Veterinario | A (grilla semanal) | Gap cerrado — mencionado en HU1, sin pantalla propia hasta ahora |

---

## 5. Detalle por pantalla

### P00 — Login
- **No usa el shell** (pantalla previa a autenticarse).
- Funcionalidad: formulario `username` + `password` → `POST /api/auth/login`. Error de credenciales se muestra junto al formulario, sin indicar cuál campo falló.
- Sin registro público — los usuarios los crea un Administrador desde P02.

### P01 — Dashboard (Patrón C)
- Mensaje de bienvenida con nombre y rol.
- Una tarjeta por módulo habilitado para el rol activo (según la tabla de la sección 1); cada tarjeta navega a su pantalla.
- No trae datos de negocio propios — es solo el punto de entrada/navegación.

### P02 — Gestión de Usuarios (Patrón A, extendido)
- Lista: nombre, ci, username, rol, estado, acciones.
- Formulario "+ Nuevo": nombre, apellidos, ci, username, rol, contraseña, confirmar contraseña.
- **Comportamiento condicional:** si `rol = VETERINARIO`, el formulario despliega dos campos adicionales — matrícula y especialidad — que se envían junto con el alta para crear también el perfil de `Veterinario` (1 a 1 con `Usuario`, ver `database/MODELO_DATOS.md`). Esto evita una pantalla separada de "alta de veterinario".
- **Cambiar rol** (gap cerrado, sesión posterior): botón por fila (oculto en la propia cuenta del admin logueado) que abre un diálogo con selector de rol; si el nuevo rol es Veterinario y el usuario no lo era, pide matrícula/especialidad ahí mismo.
- La gestión de `Horario` de cada veterinario terminó como pantalla propia — ver P16, no una sub-sección de esta.

### P03 — Gestión de Propietarios (Patrón A)
- Lista: nombre, ci, teléfono, dirección, mascotas (chips clicables — cada uno navega a la ficha de esa mascota, P15), acciones. Buscador por nombre/CI.
- Formulario compartido con el flujo de alta de mascota (ver P04) cuando se registra desde cero; esta pantalla es para editar propietarios ya existentes (incluida la dirección) o darlos de alta sin mascota todavía.

### P04 — Gestión de Mascotas (Patrón A)
- Lista: nombre, especie, raza, sexo, peso, propietario; filas clicables → ficha de la mascota (P15). Buscador por nombre y toggle "Mostrar inactivas" (oculto por defecto; con él activo se agrega columna de estado y badge "Inactiva").
- Formulario de alta: **combina datos de mascota y propietario** en un solo paso (según HU2). Al ingresar el CI del propietario, se dispara `GET /api/propietarios/buscar?ci=` — si existe, se precargan sus datos de solo lectura; si no, se completan como alta nueva.
- Errores 409 (mascota duplicada para el mismo propietario) se muestran junto al campo, sin perder lo ya escrito.
- **Eliminar** (gap cerrado, sesión posterior) vive en la ficha (P15), no en esta lista — ver ahí.

### P05 — Atención Médica (Patrón B)
- Antes de buscar: estado inicial con ícono y texto guía (gap cerrado, sesión posterior) en vez de un buscador vacío sin contexto.
- Buscador por CI del propietario → lista de sus mascotas → selección de una → historial médico completo. El header de la mascota seleccionada muestra especie/raza/dueño y además sexo, edad y peso (gap cerrado).
- "+ Nueva" abre el formulario de atención: diagnóstico, tratamiento, exámenes externos (opcional), peso actual (opcional), monto, y el selector opcional de medicamentos consumidos (HU9, cantidad por medicamento).
- El historial muestra el estado de pago de cada atención (Pendiente/Pagado) como badge — enlaza a P06 cuando está pendiente — y ahora también el peso y los exámenes externos registrados en esa visita, cuando existen (gap cerrado: se capturaban pero no se mostraban de vuelta).
- Estado vacío (mascota sin atenciones) con mensaje orientador y CTA hacia "+ Nueva" (gap cerrado).

### P06 — Gestión de Pagos (Patrón A, variante)
- No tiene "Editar" ni "Eliminar" sobre pagos ya registrados: la sección principal es la lista de atenciones **pendientes de pago** por cliente, con acción "Registrar pago" por fila (abre el formulario: método de pago, monto). Al confirmar, la fila desaparece de la lista de pendientes.
- **Últimos pagos** (gap cerrado, sesión posterior): segunda sección debajo, con los 5 pagos más recientes ya registrados (mascota, propietario, monto, método, fecha) — antes esta pantalla solo mostraba pendientes, sin ninguna vista de lo ya cobrado.
- El método de pago incluye QR desde el diseño de base (aunque el HU12 que lo popularizó es opcional/Fase 7).

### P07 — Gestión de Citas (Patrón E)
- Pestaña "Lista de Citas": agenda agrupada por día ("Hoy", "Mañana", fecha completa), con acciones Marcar atendida / Cancelar por fila. Si el rol es Veterinario, aparece un toggle "Solo mis citas" (activado por defecto) que filtra por su propia agenda.
- Pestaña "Nueva Cita": selects de Mascota/Tipo/Fecha; el campo Veterinario es un select para Admin/Recepcionista, pero se bloquea auto-completado con "Tú" si el rol es Veterinario (no puede agendar para otro). Los horarios disponibles se agrupan en Mañana/Tarde. Antes de confirmar se muestra un resumen en lenguaje natural de la cita a crear.
- Reprogramar reabre este mismo formulario, precargado.
- **Restricción de negocio:** un Veterinario solo puede agendar citas para sí mismo; Administrador y Recepcionista pueden agendar para cualquier veterinario. Validado en frontend (campo bloqueado) y en backend (403 si se fuerza otro `veterinarioId`).

### P08 — Control Preventivo (Patrón A + panel adicional)
- Se accede desde la ficha de una mascota (formulario de alta: tipo, fecha de aplicación, próxima dosis) y también como pantalla propia con un **panel de "Próximos a vencer"** (todas las mascotas, ordenado por fecha) para uso diario del veterinario.
- Los controles vencidos se marcan con un badge distintivo en ambas vistas.

### P09 — Reporte de Ingresos (Patrón D)
- Filtros: rango de fechas, tipo de servicio.
- Resultado: totales (cantidad, monto) + tabla de pagos que cumplen el filtro. Sin gráfico (eso es P10).
- Acceso restringido a Administrador; si otro rol llega por URL directa, redirige con aviso.

### P10 — Reportes Clínicos y Administrativos (Patrón D)
- Selector de tipo de reporte + rango de fechas.
- Resultado: gráfico de ingresos por tipo de servicio + tabla, con botones "Exportar PDF" / "Exportar Excel".

### P11 — Gestión de Inventario (Patrón A + alerta)
- Lista de medicamentos: nombre, stock actual, stock mínimo, estado, acciones ("Registrar entrada", "Editar", "Eliminar"). El CRUD del catálogo (crear/editar/eliminar un medicamento) es un gap cerrado en sesión posterior — antes solo existía alta de stock sobre medicamentos ya sembrados manualmente. "Eliminar" muestra modal de confirmación y el backend lo rechaza (409) si el medicamento ya tiene movimientos de inventario registrados.
- Banner de alerta en la parte superior si hay medicamentos en bajo stock, visible apenas se entra al módulo (no hay que buscarlo).

### P12 (opcional) — Recordatorios WhatsApp
- Lista de recordatorios pendientes de hoy (citas < 24h, controles preventivos a 7 días), cada fila con un botón que abre WhatsApp con el mensaje precargado, y un botón "Marcar como enviado".
- No es un formulario CRUD — es una lista de acciones a ejecutar, se vacía a medida que se marcan como enviadas.
- **Últimos enviados** (gap cerrado, sesión posterior): segunda sección debajo con los 5 recordatorios marcados como enviados más recientes (propietario, mensaje, fecha) — antes no había ninguna vista de lo ya enviado.

### P13 (opcional) — Importar clientes desde Excel
- Zona de carga de archivo (.xlsx) + botón "Importar".
- Tras procesar: tabla de resultado con dos secciones — filas importadas correctamente y filas con error (número de fila + motivo).

### P14 (opcional) — Configuración
- Agrupa dos utilidades administrativas que no ameritan pantalla propia: panel de tasa de entregabilidad de notificaciones (HU11-B) y botón "Exportar todos mis datos" (HU15) con indicador de progreso.

---

## 6. Componentes compartidos

Identificados por repetirse en 3 o más pantallas — construirlos una vez evita duplicar lógica:

| Componente | Usado en | Responsabilidad |
|---|---|---|
| `Sidebar` / `Header` | shell completo | navegación filtrada por rol, datos de sesión |
| `DataTable` | P02–P04, P06, P07, P09–P11 | tabla con orden, paginación y slot de acciones por fila |
| `FormModal` | P02–P04, P08, P11 | contenedor de formulario (alta/edición) con validación y estados de guardado |
| `Badge` | P05 (estado pago), P07 (estado cita), P08 (vencido), P02 (estado usuario) | etiqueta de estado con color semántico consistente |
| `SearchInput` | P03–P05 | campo de búsqueda con debounce |
| `DateRangeFilter` | P09, P10 | selector de "desde/hasta" reutilizado en ambos reportes |
| `Toast` | todas | confirmaciones de éxito y errores de red/validación |
| `FileDropzone` | P13 | carga de archivo con validación de tipo/tamaño |
| `EmptyState` | todas las listas | mensaje consistente cuando una tabla no tiene resultados |

---

## 7. Estados que toda pantalla con datos remotos debe manejar

- **Cargando:** placeholder simple (no bloquear la navegación del shell).
- **Vacío:** `EmptyState` con el mensaje específico del módulo (ej. "Sin mascotas registradas todavía").
- **Error de red/servidor:** mensaje con opción de reintentar, sin perder los filtros ya aplicados.
- **Validación:** errores de campo específico junto al campo, no un alert genérico (regla explícita de varias HU: HU2, HU3, HU4).

---

## 8. Fuera de alcance de este documento

- Portal para "Dueño de Mascota" (rol mencionado en la sección de stakeholders del plan, pero el login del MVP cubre solo Administrador/Veterinario/Recepcionista — ver `docs/PLAN_PROYECTO_PAWCARE.md` sección 3). Si se agrega más adelante, necesitaría su propio conjunto de pantallas de solo lectura.
- Diseño visual final (paleta de colores, tipografía, spacing) — este documento define zonas y funcionalidad, no estilo; para eso se usa el prototipo Figma referenciado en el plan como inspiración.
