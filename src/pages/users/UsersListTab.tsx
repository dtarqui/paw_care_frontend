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
import { useFormatters } from "@/lib/useFormatters";
import { Loader2, Mail, Users, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangeRoleDialog } from "./ChangeRoleDialog";
import { InviteVetDialog } from "./InviteVetDialog";
import { NewUserDialog } from "./NewUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

const PAGE_SIZE = 20;

function isPendingApproval(user: User) {
  return user.selfRegistered && user.status === "INACTIVE";
}

export function UsersListTab() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
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
            <CardTitle className="text-base">{t("users.pendingInvitations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{invitation.name || invitation.email}</span>
                    <span className="text-muted-foreground">
                      {invitation.name && `(${invitation.email}) · `}
                      {t("users.invitedBy", {
                        name: `${invitation.invitedBy.firstName} ${invitation.invitedBy.paternalLastName}`,
                      })}{" "}
                      · {t("users.invitationExpires", { date: formatDate(invitation.expiresAt) })}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setInvitationTarget(invitation)}>
                    <X className="size-3.5" />
                    {t("common.cancel")}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("users.listTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={4} />}

          {isError && <ErrorState message={t("users.loadError")} />}

          {!isLoading && !isError && users?.length === 0 && (
            <EmptyState
              icon={Users}
              title={t("users.emptyTitle")}
              description={t("users.emptyDescription")}
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
                    subtitle={`${user.username} · ${t("common.nationalId")} ${user.nationalId}`}
                    badge={<StatusBadge status={isPendingApproval(user) ? "PENDING_APPROVAL" : user.status} />}
                    rows={[{ label: t("common.role"), value: t(`enums.role.${user.role}`) }]}
                    actions={
                      <>
                        <Button
                          variant={isPendingApproval(user) ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setStatusTarget(user)}
                        >
                          {isPendingApproval(user)
                            ? t("users.approve")
                            : user.status === "ACTIVE"
                              ? t("users.deactivate")
                              : t("users.activate")}
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button variant="outline" size="sm" onClick={() => setRoleTarget(user)}>
                            {t("users.changeRole")}
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setPasswordTarget(user)}>
                          {t("users.resetPassword")}
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
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("common.nationalId")}</TableHead>
                    <TableHead>{t("common.username")}</TableHead>
                    <TableHead>{t("common.role")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
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
                      <TableCell>{t(`enums.role.${user.role}`)}</TableCell>
                      <TableCell>
                        <StatusBadge status={isPendingApproval(user) ? "PENDING_APPROVAL" : user.status} />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.id !== currentUser?.id && (
                          <Button variant="outline" size="sm" onClick={() => setRoleTarget(user)}>
                            {t("users.changeRole")}
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setPasswordTarget(user)}>
                          {t("users.resetPassword")}
                        </Button>
                        <Button
                          variant={isPendingApproval(user) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setStatusTarget(user)}
                        >
                          {isPendingApproval(user)
                            ? t("users.approve")
                            : user.status === "ACTIVE"
                              ? t("users.deactivate")
                              : t("users.activate")}
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
                ? t("users.confirmApproveTitle")
                : statusTarget?.status === "ACTIVE"
                  ? t("users.confirmDeactivateTitle")
                  : t("users.confirmActivateTitle")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {(() => {
              const name = `${statusTarget?.firstName ?? ""} ${statusTarget?.paternalLastName ?? ""}`.trim();
              if (statusTarget && isPendingApproval(statusTarget)) return t("users.confirmApproveBody", { name });
              if (statusTarget?.status === "ACTIVE") return t("users.confirmDeactivateBody", { name });
              return t("users.confirmActivateBody", { name });
            })()}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant={statusTarget?.status === "ACTIVE" ? "destructive" : "default"}
              onClick={confirm}
              disabled={changeStatus.isPending}
            >
              {changeStatus.isPending && <Loader2 className="size-4 animate-spin" />}
              {statusTarget && isPendingApproval(statusTarget)
                ? t("users.approve")
                : statusTarget?.status === "ACTIVE"
                  ? t("users.deactivate")
                  : t("users.activate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChangeRoleDialog user={roleTarget} onClose={() => setRoleTarget(null)} />
      <ResetPasswordDialog user={passwordTarget} onClose={() => setPasswordTarget(null)} />

      <Dialog open={!!invitationTarget} onOpenChange={(v) => !v && setInvitationTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("users.confirmCancelInvitationTitle")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("users.confirmCancelInvitationBody", { email: invitationTarget?.email ?? "" })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvitationTarget(null)}>
              {t("common.back")}
            </Button>
            <Button variant="destructive" onClick={confirmCancelInvitation} disabled={cancelInvitation.isPending}>
              {cancelInvitation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("users.cancelInvitation")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
