# Frontend — PawCare

Aplicación React + Vite + TypeScript + Tailwind CSS + shadcn/ui, PWA instalable, consumiendo el backend real (Express + Prisma + PostgreSQL) por API REST.

## Correr el proyecto

Requiere el backend corriendo en paralelo (ver `../backend/README.md`).

```bash
cp .env.example .env   # apunta a http://localhost:4000 por defecto
npm install
npm run dev              # http://localhost:5173
```

Login con cualquiera de los usuarios listados en `../backend/README.md`.

## Qué cubre

Las 3 pantallas por rol (Administrador, Veterinario, Recepcionista) y sus permisos vienen del backend (`GET /api/dashboard/modulos`), no están hardcodeadas en el frontend:

- **Mascotas** — listado, alta (con detección de propietario existente por CI), importación masiva desde Excel (Administrador)
- **Atención Médica** — búsqueda por CI, historial, nueva atención (con veterinario bloqueado a "sí mismo" cuando el rol es Veterinario) y consumo de medicamentos del inventario
- **Citas** — agendar, reprogramar, cambiar estado, chequeo de disponibilidad real contra el backend
- **Control Preventivo** — vacunación y desparasitación, alertas de próximos a vencer
- **Pagos** — cobro de atenciones pendientes
- **Recordatorios** — WhatsApp manual (enlaces `wa.me`) para citas próximas y controles por vencer
- **Reportes** — ingresos (HU7) y reportes clínicos con gráfico (HU8), exportables a Excel/PDF
- **Inventario** — stock de medicamentos, alertas de bajo stock, registro de entradas
- **Usuarios** — alta de cuentas con rol (Administrador)
- **Configuración** — datos de la cuenta, exportación completa de datos (Administrador)

Estados de carga (skeletons), validaciones, toasts de éxito/error, sidebar responsive (drawer en móvil), y PWA instalable (manifest + service worker).

## Documentación

- **Pantallas y navegación:** [PANTALLAS.md](PANTALLAS.md) — mapa de navegación por rol y patrones de pantalla reutilizables.
- **Historial de construcción:** [TASKS.md](TASKS.md) — HU cubiertas, alineadas con `backend/TASKS.md`.

## Arquitectura de carpetas

Organizado por *features* (dominio) + capas de UI, para que cada pieza tenga un solo lugar donde vivir:

```
src/
├── features/        Un folder por dominio: api.ts (llamadas HTTP) + hooks de
│                     React Query (useX.ts) + types.ts. Ningún componente llama
│                     fetch directo — siempre pasa por acá.
├── components/
│   ├── ui/           Componentes shadcn/ui (generados, no editar a mano el core)
│   ├── layout/        AppShell, Header, Sidebar
│   ├── ProtectedRoute.tsx
│   └── StatusBadge.tsx
├── pages/            Componen features + components por pantalla (poca lógica propia)
└── lib/              api-client.ts (fetch centralizado), query-client.ts, date.ts, utils.ts
```

Agregar una pantalla nueva = agregar su `feature/` (si consume datos nuevos) + su `page` + su ruta en `App.tsx`.

## Deploy en Vercel

Zero-config (framework Vite auto-detectado): `npm run build` genera un sitio estático en `dist/`. [`vercel.json`](vercel.json) agrega el rewrite de fallback SPA (`/(.*)` → `/index.html`) explícito, necesario porque las rutas las maneja React Router del lado del cliente (sin esto, refrescar una URL como `/app/mascotas` daría 404).

En el proyecto de Vercel (Project Settings → Environment Variables) hay que configurar `VITE_API_URL` apuntando a la URL desplegada del backend — Vite la incrusta en el build, así que cualquier cambio requiere un nuevo deploy.

## Licencia

Todos los derechos reservados — ver [LICENSE](LICENSE).
