import { PetSearchByNationalId } from "@/components/PetSearchByNationalId";
import type { Pet } from "@/features/pets/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PreventiveHistory } from "./PreventiveHistory";
import { UpcomingControlsPanel } from "./UpcomingControlsPanel";

export function PreventiveControlsPage() {
  const { t } = useTranslation();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("preventive.title")}</h1>
        <p className="text-muted-foreground">{t("preventive.subtitle")}</p>
      </div>

      <UpcomingControlsPanel />

      <PetSearchByNationalId selectedPetId={selectedPet?.id} onSelect={setSelectedPet} />

      {selectedPet && <PreventiveHistory pet={selectedPet} />}
    </div>
  );
}
