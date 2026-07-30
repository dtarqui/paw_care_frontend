import { BuscadorMascotaPorCi } from "@/components/BuscadorMascotaPorCi";
import type { Mascota } from "@/features/mascotas/types";
import { useState } from "react";
import { HistorialPreventivo } from "./HistorialPreventivo";
import { ProximosAVencerPanel } from "./ProximosAVencerPanel";

export function ControlPreventivoPage() {
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Control Preventivo</h1>
        <p className="text-muted-foreground">Vacunación y desparasitación</p>
      </div>

      <ProximosAVencerPanel />

      <BuscadorMascotaPorCi mascotaSeleccionadaId={mascotaSeleccionada?.id} onSeleccionar={setMascotaSeleccionada} />

      {mascotaSeleccionada && <HistorialPreventivo mascota={mascotaSeleccionada} />}
    </div>
  );
}
