import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useVisitHistory } from "@/features/medical-visits/useMedicalVisits";
import type { Pet } from "@/features/pets/types";
import { calculateAge } from "@/lib/pet";
import { useFormatters } from "@/lib/useFormatters";
import { FilePlus2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NewVisitDialog } from "./NewVisitDialog";

export function VisitHistory({ pet }: { pet: Pet }) {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { data: visits, isLoading, isError } = useVisitHistory(pet.id);
  const age = calculateAge(pet.birthDate);

  return (
    <Card>
      <CardHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <CardTitle className="text-base">
              {pet.name}{" "}
              <span className="font-normal text-muted-foreground">
                ({t(`enums.species.${pet.species}`, { defaultValue: pet.species })} · {pet.breed})
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="size-3.5" />
              {pet.owner.firstName} {pet.owner.paternalLastName}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {pet.sex && (
              <Badge variant="secondary" className="border-none font-normal">
                {t(`enums.sex.${pet.sex}`, { defaultValue: pet.sex })}
              </Badge>
            )}
            {age && (
              <Badge variant="secondary" className="border-none font-normal">
                {t(`pets.age.${age.unit}`, { count: age.count })}
              </Badge>
            )}
            {pet.weight && (
              <Badge variant="secondary" className="border-none font-normal">
                {pet.weight} kg
              </Badge>
            )}
          </div>
        </div>
        <NewVisitDialog pet={pet} />
      </CardHeader>
      <CardContent>
        {isLoading && (
<TableSkeleton rows={2} />
        )}

        {isError && <p className="py-6 text-center text-sm text-destructive">{t("visits.historyLoadError")}</p>}

        {!isLoading && !isError && visits?.length === 0 && (
          <EmptyState
            icon={FilePlus2}
            title={t("visits.emptyTitle", { name: pet.name })}
            description={t("visits.emptyDescription")}
          />
        )}

        {!isLoading && !isError && visits && visits.length > 0 && (
          <div className="flex flex-col divide-y">
            {visits.map((visit) => (
              <div key={visit.id} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {formatDate(visit.date)} <span className="font-normal text-muted-foreground">· {visit.serviceType}</span>
                  </span>
                  <StatusBadge status={visit.paymentStatus} />
                </div>
                <p className="text-sm">
                  <span className="font-medium">{t("visits.diagnosisLabel")}</span> {visit.diagnosis}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t("visits.treatmentLabel")}</span> {visit.treatment}
                </p>
                {visit.externalExams && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{t("visits.externalExamsLabel")}</span> {visit.externalExams}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {visit.vet.firstName} {visit.vet.paternalLastName} · Bs. {visit.consultationFee.toFixed(2)}
                  {visit.weight !== undefined && <> · {t("visits.recordedWeight", { weight: visit.weight })}</>}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
