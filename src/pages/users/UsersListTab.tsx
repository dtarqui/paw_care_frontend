import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { Pagination } from "@/components/Pagination";
import { TableSkeleton } from "@/components/TableSkeleton";
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

function isPendingApproval(user: User) {
  return user.selfRegistered && user.status === "INACTIVE";
}

function formatDate(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function UsersListTab() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsers(page, PAGE_SIZE);
  const users = data?.users;
  const { data: invitations } = usePendingInvitations();
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [invitationTarget, setInvitationTarget] = useState<PendingInvitation | null>(null);
  const changeStatus = useChangeUserStatus();
  const cancelInvitation = useCancelInvitation();

  async function confirm() {
    if (!statusTarget) return;
    const newStatus = statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await changeStatus.mutateAsync({ id: statusTarget.id, status: newStatus });
    setStatusTarget(null);
  }

  async function confirmCancelInvitation() {
    if (!invitationTarget) return;
    await cancelInvitation.mutateAsync(invitationTarget.id);
    setInvitationTarget(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end gap-2">
        <InviteVetDialog />
        <NewUserDialog />
      </div>

      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invitaciones pendientes</CardTitle>
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
                      {invitation.invitedBy.paternalLastName} · vence {formatDate(invitation.expiresAt)}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setInvitationTarget(invitation)}>
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
          {isLoading && <TableSkeleton rows={4} />}

          {isError && <ErrorState message="No se pudo cargar el listado de usuarios." />}

          {!isLoading && !isError && users?.length === 0 && (
            <EmptyState
              icon={Users}
              title="Sin usuarios registrados todavía"
              description="Creá cuentas para el personal, o invitá a un veterinario por email."
              action={<NewUserDialog />}
            />
          )}

          {!isLoading && !isError && users && users.length > 0 && (
            <>
              <MobileCardList>
                {users.map((user) => (
                  <MobileCard
                    key={user.id}
                    title={`${user.firstName} ${user.paternalLastName}`}
                    subtitle={`${user.username} · CI ${user.nationalId}`}
                    badge={<StatusBadge status={isPendingApproval(user) ? "PENDING_APPROVAL" : user.status} />}
                    rows={[{ label: "Rol", value: ROLE_LABEL[user.role] }]}
                    actions={
                      <>
                        <Button
                          variant={isPendingApproval(user) ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setStatusTarget(user)}
                        >
                          {isPendingApproval(user) ? "Aprobar" : user.status === "ACTIVE" ? "Desactivar" : "Activar"}
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button variant="outline" size="sm" onClick={() => setRoleTarget(user)}>
                            Cambiar rol
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setPasswordTarget(user)}>
                          Restablecer contraseña
                        </Button>
                      </>
                    }
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.paternalLastName}
                      </TableCell>
                      <TableCell>{user.nationalId}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{ROLE_LABEL[user.role]}</TableCell>
                      <TableCell>
                        <StatusBadge status={isPendingApproval(user) ? "PENDING_APPROVAL" : user.status} />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.id !== currentUser?.id && (
                          <Button variant="outline" size="sm" onClick={() => setRoleTarget(user)}>
                            Cambiar rol
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setPasswordTarget(user)}>
                          Restablecer contraseña
                        </Button>
                        <Button
                          variant={isPendingApproval(user) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setStatusTarget(user)}
                        >
                          {isPendingApproval(user) ? "Aprobar" : user.status === "ACTIVE" ? "Desactivar" : "Activar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </DesktopTable>
              {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!statusTarget} onOpenChange={(v) => !v && setStatusTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {statusTarget && isPendingApproval(statusTarget)
                ? "¿Aprobar solicitud?"
                : statusTarget?.status === "ACTIVE"
                  ? "¿Desactivar cuenta?"
                  : "¿Activar cuenta?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {statusTarget && isPendingApproval(statusTarget)
              ? `${statusTarget.firstName} ${statusTarget.paternalLastName} podrá iniciar sesión como Veterinario y aparecerá en los selectores de agendar/atender.`
              : statusTarget?.status === "ACTIVE"
                ? `${statusTarget?.firstName} ${statusTarget?.paternalLastName} ya no podrá iniciar sesión, y dejará de aparecer en los selectores de veterinario para agendar o atender.`
                : `${statusTarget?.firstName} ${statusTarget?.paternalLastName} podrá volver a iniciar sesión.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant={statusTarget?.status === "ACTIVE" ? "destructive" : "default"}
              onClick={confirm}
              disabled={changeStatus.isPending}
            >
              {changeStatus.isPending && <Loader2 className="size-4 animate-spin" />}
              {statusTarget && isPendingApproval(statusTarget) ? "Aprobar" : statusTarget?.status === "ACTIVE" ? "Desactivar" : "Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChangeRoleDialog user={roleTarget} onClose={() => setRoleTarget(null)} />
      <ResetPasswordDialog user={passwordTarget} onClose={() => setPasswordTarget(null)} />

      <Dialog open={!!invitationTarget} onOpenChange={(v) => !v && setInvitationTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Cancelar invitación?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            El enlace que le enviamos a {invitationTarget?.email} dejará de funcionar.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvitationTarget(null)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={confirmCancelInvitation} disabled={cancelInvitation.isPending}>
              {cancelInvitation.isPending && <Loader2 className="size-4 animate-spin" />}
              Cancelar invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
