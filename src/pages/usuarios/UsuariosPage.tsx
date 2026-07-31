import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/features/auth/AuthContext";
import { useCambiarEstadoUsuario, useCancelarInvitacion, useInvitacionesPendientes, useUsuarios } from "@/features/usuarios/useUsuarios";
import type { InvitacionPendiente, Usuario } from "@/features/usuarios/types";
import { ROL_LABEL } from "@/lib/roles";
import { Loader2, Mail, Users, X } from "lucide-react";
import { useState } from "react";
import { CambiarRolDialog } from "./CambiarRolDialog";
import { InvitarVeterinarioDialog } from "./InvitarVeterinarioDialog";
import { NuevoUsuarioDialog } from "./NuevoUsuarioDialog";
import { RestablecerPasswordDialog } from "./RestablecerPasswordDialog";

const PAGE_SIZE = 20;

function esPendienteDeAprobacion(usuario: Usuario) {
  return usuario.autorregistrado && usuario.estado === "INACTIVO";
}

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function UsuariosPage() {
  const { usuario: usuarioActual } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsuarios(page, PAGE_SIZE);
  const usuarios = data?.usuarios;
  const { data: invitaciones } = useInvitacionesPendientes();
  const [objetivo, setObjetivo] = useState<Usuario | null>(null);
  const [objetivoRol, setObjetivoRol] = useState<Usuario | null>(null);
  const [objetivoPassword, setObjetivoPassword] = useState<Usuario | null>(null);
  const [objetivoInvitacion, setObjetivoInvitacion] = useState<InvitacionPendiente | null>(null);
  const cambiarEstado = useCambiarEstadoUsuario();
  const cancelarInvitacion = useCancelarInvitacion();

  async function confirmar() {
    if (!objetivo) return;
    const nuevoEstado = objetivo.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    await cambiarEstado.mutateAsync({ id: objetivo.id, estado: nuevoEstado });
    setObjetivo(null);
  }

  async function confirmarCancelarInvitacion() {
    if (!objetivoInvitacion) return;
    await cancelarInvitacion.mutateAsync(objetivoInvitacion.id);
    setObjetivoInvitacion(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Registro y gestión de cuentas del sistema</p>
        </div>
        <div className="flex gap-2">
          <InvitarVeterinarioDialog />
          <NuevoUsuarioDialog />
        </div>
      </div>

      {invitaciones && invitaciones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invitaciones pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {invitaciones.map((invitacion) => (
                <div key={invitacion.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{invitacion.nombre || invitacion.email}</span>
                    <span className="text-muted-foreground">
                      {invitacion.nombre && `(${invitacion.email}) · `}invitó {invitacion.invitadoPor.nombre}{" "}
                      {invitacion.invitadoPor.apellidoPaterno} · vence {formatearFecha(invitacion.expiraEn)}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setObjetivoInvitacion(invitacion)}>
                    <X className="size-3.5" />
                    Cancelar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el listado de usuarios.</p>}

          {!isLoading && !isError && usuarios?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="size-8" />
              <p>Sin usuarios registrados todavía.</p>
            </div>
          )}

          {!isLoading && !isError && usuarios && usuarios.length > 0 && (
            <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nombre} {usuario.apellidoPaterno}
                      </TableCell>
                      <TableCell>{usuario.ci}</TableCell>
                      <TableCell>{usuario.username}</TableCell>
                      <TableCell>{ROL_LABEL[usuario.rol]}</TableCell>
                      <TableCell>
                        <StatusBadge status={esPendienteDeAprobacion(usuario) ? "PENDIENTE_APROBACION" : usuario.estado} />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {usuario.id !== usuarioActual?.id && (
                          <Button variant="outline" size="sm" onClick={() => setObjetivoRol(usuario)}>
                            Cambiar rol
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setObjetivoPassword(usuario)}>
                          Restablecer contraseña
                        </Button>
                        <Button
                          variant={esPendienteDeAprobacion(usuario) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setObjetivo(usuario)}
                        >
                          {esPendienteDeAprobacion(usuario) ? "Aprobar" : usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!objetivo} onOpenChange={(v) => !v && setObjetivo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {objetivo && esPendienteDeAprobacion(objetivo)
                ? "¿Aprobar solicitud?"
                : objetivo?.estado === "ACTIVO"
                  ? "¿Desactivar cuenta?"
                  : "¿Activar cuenta?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {objetivo && esPendienteDeAprobacion(objetivo)
              ? `${objetivo.nombre} ${objetivo.apellidoPaterno} podrá iniciar sesión como Veterinario y aparecerá en los selectores de agendar/atender.`
              : objetivo?.estado === "ACTIVO"
                ? `${objetivo?.nombre} ${objetivo?.apellidoPaterno} ya no podrá iniciar sesión, y dejará de aparecer en los selectores de veterinario para agendar o atender.`
                : `${objetivo?.nombre} ${objetivo?.apellidoPaterno} podrá volver a iniciar sesión.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setObjetivo(null)}>
              Cancelar
            </Button>
            <Button
              variant={objetivo?.estado === "ACTIVO" ? "destructive" : "default"}
              onClick={confirmar}
              disabled={cambiarEstado.isPending}
            >
              {cambiarEstado.isPending && <Loader2 className="size-4 animate-spin" />}
              {objetivo && esPendienteDeAprobacion(objetivo) ? "Aprobar" : objetivo?.estado === "ACTIVO" ? "Desactivar" : "Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CambiarRolDialog usuario={objetivoRol} onClose={() => setObjetivoRol(null)} />
      <RestablecerPasswordDialog usuario={objetivoPassword} onClose={() => setObjetivoPassword(null)} />

      <Dialog open={!!objetivoInvitacion} onOpenChange={(v) => !v && setObjetivoInvitacion(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Cancelar invitación?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            El enlace que le enviamos a {objetivoInvitacion?.email} dejará de funcionar.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setObjetivoInvitacion(null)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={confirmarCancelarInvitacion} disabled={cancelarInvitacion.isPending}>
              {cancelarInvitacion.isPending && <Loader2 className="size-4 animate-spin" />}
              Cancelar invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
