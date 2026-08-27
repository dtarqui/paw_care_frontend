import { PetSearchByNationalId } from "@/components/PetSearchByNationalId";
import { Card, CardContent } from "@/components/ui/card";
import type { Pet } from "@/features/pets/types";
import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VisitHistory } from "./VisitHistory";

export function MedicalVisitsPage() {
  const { t } = useTranslation();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("visits.title")}</h1>
        <p className="text-muted-foreground">{t("visits.subtitle")}</p>
      </div>

      <PetSearchByNationalId selectedPetId={selectedPet?.id} onSelect={setSelectedPet} />

      {selectedPet ? (
        <VisitHistory pet={selectedPet} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="size-7" />
            </div>
            <div>
              <p className="font-medium text-foreground">{t("visits.searchToStart")}</p>
              <p className="text-sm">{t("visits.searchToStartHint")}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
