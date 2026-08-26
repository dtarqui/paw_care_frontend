import { PetSearchByNationalId } from "@/components/PetSearchByNationalId";
import { Card, CardContent } from "@/components/ui/card";
import type { Pet } from "@/features/pets/types";
import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { VisitHistory } from "./VisitHistory";

export function MedicalVisitsPage() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Atención Médica</h1>
        <p className="text-muted-foreground">Busca una mascota por la cédula del propietario para ver o iniciar su atención médica</p>
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
              <p className="font-medium text-foreground">Busca una mascota para empezar</p>
              <p className="text-sm">
                Ingresa la cédula de identidad del propietario en el buscador de arriba para ver el historial clínico de sus
                mascotas o registrar una nueva atención.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
