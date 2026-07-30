# Frontend — PawCare

Aplicación React + Vite + TypeScript + Tailwind CSS + shadcn/ui, consumiendo el backend por API REST.

## Correr la demo

Requiere el backend corriendo en paralelo (ver `../backend/README.md`).

```bash
cp .env.example .env   # apunta a http://localhost:4000 por defecto
npm install
npm run dev              # http://localhost:5173
```

Login con cualquiera de los usuarios de demo listados en `../backend/README.md`. Cubre 5 pantallas (Login, Dashboard, Mascotas, Citas — lista y nueva cita con chequeo de disponibilidad real —, Pagos), con estados de carga (skeletons), validaciones, toasts de éxito/error, y sidebar responsive (drawer en móvil).

## Documentación

- **Pantallas y navegación:** [PANTALLAS.md](PANTALLAS.md) — mapa de navegación por rol, patrones de pantalla reutilizables, y detalle de cada pantalla. Cubre las 14 pantallas del alcance completo; esta demo implementa un subconjunto (sección 1 del mapa: Dashboard, Mascotas, Citas, Pagos).
- **Cola de construcción del resto:** [TASKS.md](TASKS.md) — tareas restantes (Propietarios, Usuarios, Veterinarios, Atención Médica, reportes, inventario, Fase 7) alineadas con `backend/TASKS.md`.

## Arquitectura de carpetas

Organizado por *features* (dominio) + capas de UI, para que cada pieza tenga un solo lugar donde vivir:

```
src/
├── features/        Un folder por dominio: api.ts (llamadas HTTP) + hooks de
│                     React Query (useX.ts) + types.ts. Ningún componente llama
│                     fetch directo — siempre pasa por acá.
│   ├── auth/         AuthContext (sesión, login, logout)
│   ├── dashboard/
│   ├── mascotas/
│   ├── citas/
│   ├── pagos/
│   └── veterinarios/
├── components/
│   ├── ui/           Componentes shadcn/ui (generados, no editar a mano el core)
│   ├── layout/        AppShell, Header, Sidebar
│   ├── ProtectedRoute.tsx
│   └── StatusBadge.tsx
├── pages/            Componen features + components por pantalla (poca lógica propia)
└── lib/              api-client.ts (fetch centralizado), query-client.ts, utils.ts
```

Agregar una pantalla nueva = agregar su `feature/` (si consume datos nuevos) + su `page` + su ruta en `App.tsx`.
