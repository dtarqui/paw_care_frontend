import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import type { PetHistoryEvent } from "@/features/pets/types";
import { useChangePetStatus, usePetHistory, usePet } from "@/features/pets/usePets";
import { calculateAge } from "@/lib/pet";
import { useFormatters } from "@/lib/useFormatters";
import { AlertTriangle, Loader2, PawPrint, Phone, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { EditPetDialog } from "./EditPetDialog";
import { PetWeightChart, type WeightPoint } from "./PetWeightChart";
import { PetHistoryTimeline } from "./PetHistoryTimeline";

export function PetDetailPage() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { id } = useParams<{ id: string }>();
  const petId = Number(id);

  const { data: pet, isLoading, isError } = usePet(petId);
  const { data: events, isLoading: loadingHistory } = usePetHistory(petId);
  const changeStatusMutation = useChangePetStatus(petId);
  const [confirming, setConfirming] = useState(false);
  const petAge = pet?.birthDate ? calculateAge(pet.birthDate) : null;

  async function confirmStatusChange() {
    if (!pet) return;
    await changeStatusMutation.mutateAsync(pet.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
    setConfirming(false);
  }

  function isVisitWithWeight(e: PetHistoryEvent): e is Extract<PetHistoryEvent, { type: "VISIT" }> {
    return e.type === "VISIT" && e.visit.weight !== undefined;
  }

  const weightPoints: WeightPoint[] =
    events
      ?.filter(isVisitWithWeight)
      .map((e) => ({ date: e.visit.date, weight: e.visit.weight! }))
      .reverse() ?? []; // el historial viene descendente; el gráfico necesita orden ascendente

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs
        items={[
          { label: t("pets.title"), to: "/app/pets" },
          { label: pet?.name ?? t("pets.detailFallback") },
        ]}
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && <p className="py-8 text-center text-sm text-destructive">{t("pets.detailLoadError")}</p>}

      {!isLoading && !isError && pet && (
        <>
          {pet.status === "INACTIVE" && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
              <AlertTriangle className="size-5 shrink-0" />
              <p className="text-sm">{t("pets.inactiveNotice")}</p>
            </div>
          )}

          <Card>
            <CardHeader className="flex-col items-stretch gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PawPrint className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t(`enums.species.${pet.species}`, { defaultValue: pet.species })}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                    {pet.sex ? ` · ${t(`enums.sex.${pet.sex}`, { defaultValue: pet.sex })}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <EditPetDialog pet={pet} />
                <Button
                  variant={pet.status === "ACTIVE" ? "destructive" : "outline"}
                  onClick={() => setConfirming(true)}
                >
                  {pet.status === "ACTIVE" ? t("pets.deletePet") : t("pets.reactivate")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t("pets.birthDate")}</p>
                  <p className="text-sm font-medium">{formatDate(pet.birthDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("pets.age.label")}</p>
                  <p className="text-sm font-medium">{petAge ? t(`pets.age.${petAge.unit}`, { count: petAge.count }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("pets.currentWeight")}</p>
                  <p className="text-sm font-medium">{pet.weight ? `${pet.weight} kg` : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("pets.sex")}</p>
                  <p className="text-sm font-medium">
                    {pet.sex ? t(`enums.sex.${pet.sex}`, { defaultValue: pet.sex }) : "—"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="gap-1.5 border-none font-normal">
                  <User className="size-3.5" />
                  {pet.owner.firstName} {pet.owner.paternalLastName} · {t("common.nationalId")} {pet.owner.nationalId}
                </Badge>
                {pet.owner.phone && (
                  <Badge variant="secondary" className="gap-1.5 border-none font-normal">
                    <Phone className="size-3.5" />
                    {pet.owner.phone}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {weightPoints.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("pets.weightTrend")}</CardTitle>
              </CardHeader>
              <CardContent>
                <PetWeightChart points={weightPoints} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("pets.history")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("pets.historyDescription")}</p>
            </CardHeader>
            <CardContent>
              {loadingHistory && (
<TableSkeleton rows={3} />
              )}
              {!loadingHistory && <PetHistoryTimeline events={events ?? []} />}
            </CardContent>
          </Card>
        </>
      )}

      {pet && (
        <Dialog open={confirming} onOpenChange={setConfirming}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{pet.status === "ACTIVE" ? t("pets.confirmDeleteTitle") : t("pets.confirmReactivateTitle")}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {pet.status === "ACTIVE"
                ? t("pets.confirmDeleteBody", { name: pet.name })
                : t("pets.confirmReactivateBody", { name: pet.name })}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirming(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                variant={pet.status === "ACTIVE" ? "destructive" : "default"}
                onClick={confirmStatusChange}
                disabled={changeStatusMutation.isPending}
              >
                {changeStatusMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                {pet.status === "ACTIVE" ? t("common.delete") : t("pets.reactivate")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
