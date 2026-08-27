import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/features/users/types";
import { useResetPassword } from "@/features/users/useUsers";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

export function ResetPasswordDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const resetPasswordMutation = useResetPassword();

  function resetAndClose() {
    setNewPassword("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!user) return;
    if (newPassword.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync({ id: user.id, newPassword });
      resetAndClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.resetError"));
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("users.resetPassword")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t("users.resetPasswordBody", {
              name: `${user?.firstName ?? ""} ${user?.paternalLastName ?? ""}`.trim(),
              username: user?.username ?? "",
            })}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
            <Input
              id="newPassword"
              type="text"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("auth.minSixCharacters")}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetAndClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("users.reset")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
