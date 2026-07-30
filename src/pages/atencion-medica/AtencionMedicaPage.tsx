import { BuscadorMascotaPorCi } from "@/components/BuscadorMascotaPorCi";
import type { Mascota } from "@/features/mascotas/types";
import { useState } from "react";
import { HistorialAtenciones } from "./HistorialAtenciones";

export function AtencionMedicaPage() {
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Atención Médica</h1>
        <p className="text-muted-foreground">Busca una mascota por la cédula del propietario para ver su historial</p>
      </div>

      <BuscadorMascotaPorCi mascotaSeleccionadaId={mascotaSeleccionada?.id} onSeleccionar={setMascotaSeleccionada} />

      {mascotaSeleccionada && <HistorialAtenciones mascota={mascotaSeleccionada} />}
    </div>
  );
}
