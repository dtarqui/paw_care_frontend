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
import { useChangeUserStatus, useCancelInvitation, usePendingInvitations, useUsers } from "@/features/users/useUsers";
import type { PendingInvitation, User } from "@/features/users/types";
import { ROLE_LABEL } from "@/lib/roles";
import { Loader2, Mail, Users, X } from "lucide-react";
import { useState } from "react";
import { ChangeRoleDialog } from "./ChangeRoleDialog";
import { InviteVetDialog } from "./InviteVetDialog";
import { NewUserDialog } from "./NewUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

const PAGE_SIZE = 20;

function esPendienteDeAprobacion(user: User) {
  return user.selfRegistered && user.status === "INACTIVE";
}

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function UsersPage() {
  const { user: usuarioActual } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsers(page, PAGE_SIZE);
  const users = data?.users;
  const { data: invitations } = usePendingInvitations();
  const [objetivo, setObjetivo] = useState<User | null>(null);
  const [objetivoRol, setObjetivoRol] = useState<User | null>(null);
  const [objetivoPassword, setObjetivoPassword] = useState<User | null>(null);
  const [objetivoInvitacion, setObjetivoInvitacion] = useState<PendingInvitation | null>(null);
  const cambiarEstado = useChangeUserStatus();
  const cancelarInvitacion = useCancelInvitation();

  async function confirmar() {
    if (!objetivo) return;
    const nuevoEstado = objetivo.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await cambiarEstado.mutateAsync({ id: objetivo.id, status: nuevoEstado });
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
          <InviteVetDialog />
          <NewUserDialog />
        </div>
      </div>

      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invitaciones pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{invitation.name || invitation.email}</span>
                    <span className="text-muted-foreground">
                      {invitation.name && `(${invitation.email}) · `}invitó {invitation.invitedBy.firstName}{" "}
                      {invitation.invitedBy.paternalLastName} · vence {formatearFecha(invitation.expiresAt)}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setObjetivoInvitacion(invitation)}>
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

          {!isLoading && !isError && users?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="size-8" />
              <p>Sin usuarios registrados todavía.</p>
            </div>
          )}

          {!isLoading && !isError && users && users.length > 0 && (
            <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.paternalLastName}
                      </TableCell>
                      <TableCell>{user.nationalId}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{ROLE_LABEL[user.role]}</TableCell>
                      <TableCell>
                        <StatusBadge status={esPendienteDeAprobacion(user) ? "PENDING_APPROVAL" : user.status} />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.id !== usuarioActual?.id && (
                          <Button variant="outline" size="sm" onClick={() => setObjetivoRol(user)}>
                            Cambiar rol
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setObjetivoPassword(user)}>
                          Restablecer contraseña
                        </Button>
                        <Button
                          variant={esPendienteDeAprobacion(user) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setObjetivo(user)}
                        >
                          {esPendienteDeAprobacion(user) ? "Aprobar" : user.status === "ACTIVE" ? "Desactivar" : "Activar"}
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
                : objetivo?.status === "ACTIVE"
                  ? "¿Desactivar cuenta?"
                  : "¿Activar cuenta?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {objetivo && esPendienteDeAprobacion(objetivo)
              ? `${objetivo.firstName} ${objetivo.paternalLastName} podrá iniciar sesión como Veterinario y aparecerá en los selectores de agendar/atender.`
              : objetivo?.status === "ACTIVE"
                ? `${objetivo?.firstName} ${objetivo?.paternalLastName} ya no podrá iniciar sesión, y dejará de aparecer en los selectores de veterinario para agendar o atender.`
                : `${objetivo?.firstName} ${objetivo?.paternalLastName} podrá volver a iniciar sesión.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setObjetivo(null)}>
              Cancelar
            </Button>
            <Button
              variant={objetivo?.status === "ACTIVE" ? "destructive" : "default"}
              onClick={confirmar}
              disabled={cambiarEstado.isPending}
            >
              {cambiarEstado.isPending && <Loader2 className="size-4 animate-spin" />}
              {objetivo && esPendienteDeAprobacion(objetivo) ? "Aprobar" : objetivo?.status === "ACTIVE" ? "Desactivar" : "Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChangeRoleDialog user={objetivoRol} onClose={() => setObjetivoRol(null)} />
      <ResetPasswordDialog user={objetivoPassword} onClose={() => setObjetivoPassword(null)} />

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
