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
import { AlertTriangle, Loader2, PawPrint, Phone, User } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EditPetDialog } from "./EditPetDialog";
import { PetWeightChart, type WeightPoint } from "./PetWeightChart";
import { PetHistoryTimeline } from "./PetHistoryTimeline";

function formatDate(iso: string) {
  if (!iso) return "—";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const petId = Number(id);

  const { data: pet, isLoading, isError } = usePet(petId);
  const { data: events, isLoading: loadingHistory } = usePetHistory(petId);
  const changeStatusMutation = useChangePetStatus(petId);
  const [confirming, setConfirming] = useState(false);

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
          { label: "Mascotas", to: "/app/pets" },
          { label: pet?.name ?? "Ficha de mascota" },
        ]}
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar esta mascota.</p>}

      {!isLoading && !isError && pet && (
        <>
          {pet.status === "INACTIVE" && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
              <AlertTriangle className="size-5 shrink-0" />
              <p className="text-sm">Esta mascota está inactiva — no aparece en el listado principal ni en los buscadores.</p>
            </div>
          )}

          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PawPrint className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pet.species}
                    {pet.breed ? ` · ${pet.breed}` : ""}
                    {pet.sex ? ` · ${pet.sex}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <EditPetDialog pet={pet} />
                <Button
                  variant={pet.status === "ACTIVE" ? "destructive" : "outline"}
                  onClick={() => setConfirming(true)}
                >
                  {pet.status === "ACTIVE" ? "Eliminar mascota" : "Reactivar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
                  <p className="text-sm font-medium">{formatDate(pet.birthDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Edad</p>
                  <p className="text-sm font-medium">{calculateAge(pet.birthDate) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peso actual</p>
                  <p className="text-sm font-medium">{pet.weight ? `${pet.weight} kg` : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sexo</p>
                  <p className="text-sm font-medium">{pet.sex || "—"}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="gap-1.5 border-none font-normal">
                  <User className="size-3.5" />
                  {pet.owner.firstName} {pet.owner.paternalLastName} · CI {pet.owner.nationalId}
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
                <CardTitle className="text-base">Evolución de peso</CardTitle>
              </CardHeader>
              <CardContent>
                <PetWeightChart points={weightPoints} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historial</CardTitle>
              <p className="text-sm text-muted-foreground">Atenciones, citas, controles preventivos y ediciones, en orden cronológico</p>
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
              <DialogTitle>{pet.status === "ACTIVE" ? "¿Eliminar mascota?" : "¿Reactivar mascota?"}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {pet.status === "ACTIVE"
                ? `${pet.name} dejará de aparecer en el listado y en los buscadores. Su historial clínico no se borra y se puede reactivar en cualquier momento desde esta misma página.`
                : `${pet.name} volverá a aparecer en el listado principal y en los buscadores.`}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Cancelar
              </Button>
              <Button
                variant={pet.status === "ACTIVE" ? "destructive" : "default"}
                onClick={confirmStatusChange}
                disabled={changeStatusMutation.isPending}
              >
                {changeStatusMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                {pet.status === "ACTIVE" ? "Eliminar" : "Reactivar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
