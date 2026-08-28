import { paperQuery } from "@/features/print/paperSize";
import { apiClient } from "@/lib/api-client";
import type { NewPreventiveControlInput, PreventiveControl } from "./types";

export const preventiveControlsApi = {
  petHistory: (petId: number) =>
    apiClient.get<{ controls: PreventiveControl[] }>(`/api/pets/${petId}/preventive-controls`),

  upcoming: (days = 30) =>
    apiClient.get<{ controls: PreventiveControl[] }>(`/api/preventive-controls/upcoming?days=${days}`),

  create: (input: NewPreventiveControlInput) =>
    apiClient.post<{ control: PreventiveControl }>("/api/preventive-controls", input),

  /** El carnet de vacunación y desparasitación de una mascota, en PDF y en el tamaño
   * de papel configurado en este dispositivo. El nombre del archivo lo manda el
   * backend ya traducido; el de acá es el respaldo. */
  downloadCard: (pet: { id: number; name: string }) =>
    apiClient.download(`/api/pets/${pet.id}/vaccination-card${paperQuery()}`, `carnet-${pet.name}.pdf`),
};
