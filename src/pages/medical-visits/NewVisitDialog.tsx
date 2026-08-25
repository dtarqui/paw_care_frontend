import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/AuthContext";
import { useCreateVisit } from "@/features/medical-visits/useMedicalVisits";
import type { Pet } from "@/features/pets/types";
import { useMyVet } from "@/features/vets/useMyVet";
import { useVets } from "@/features/vets/useVets";
import { SERVICE_TYPES } from "@/lib/service-types";
import { Loader2, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { ConsumedMedicationsField, type MedicationItem } from "./ConsumedMedicationsField";

const ESTADO_INICIAL = {
  vetId: "",
  serviceType: "",
  diagnosis: "",
  treatment: "",
  externalExams: "",
  weight: "",
  consultationFee: "",
};

export function NewVisitDialog({ pet }: { pet: Pet }) {
  const { user } = useAuth();
  const esVeterinario = user?.role === "VET";
  const { data: vets, isLoading: cargandoVeterinarios } = useVets(true);
  const { myVet } = useMyVet();
  const crearAtencion = useCreateVisit();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [medications, setMedicamentos] = useState<MedicationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (esVeterinario && myVet && !form.vetId) {
      setForm((prev) => ({ ...prev, vetId: String(myVet.id) }));
    }
  }, [esVeterinario, myVet, form.vetId]);

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(field: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [field]: valor }));
  }

  function handleClose() {
    setForm(esVeterinario && myVet ? { ...ESTADO_INICIAL, vetId: String(myVet.id) } : ESTADO_INICIAL);
    setMedicamentos([]);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.vetId) {
      setError("Selecciona el veterinario que atiende");
      return;
    }
    if (!form.serviceType) {
      setError("Selecciona el tipo de servicio");
      return;
    }
    if (!form.diagnosis.trim() || !form.treatment.trim()) {
      setError("Diagnóstico y tratamiento son obligatorios");
      return;
    }

    const medicamentosValidos = medications
      .filter((m) => m.medicationId && Number(m.quantity) > 0)
      .map((m) => ({ medicationId: Number(m.medicationId), quantity: Number(m.quantity) }));

    try {
      await crearAtencion.mutateAsync({
        petId: pet.id,
        vetId: Number(form.vetId),
        serviceType: form.serviceType,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        externalExams: form.externalExams || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        consultationFee: Number(form.consultationFee) || 0,
        medications: medicamentosValidos.length > 0 ? medicamentosValidos : undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la atención");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nueva atención
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Nueva atención — {pet.name} ({pet.species})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-0.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Veterinario *</Label>
                {esVeterinario ? (
                  <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
                    <ShieldCheck className="size-4 shrink-0 text-primary" />
                    <span className="truncate">
                      {myVet ? `${myVet.firstName} ${myVet.paternalLastName}` : "Cargando…"}
                    </span>
                    <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
                      Tú
                    </Badge>
                  </div>
                ) : (
                  <Select value={form.vetId} onValueChange={(v) => actualizar("vetId", v)} disabled={cargandoVeterinarios}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione veterinario" />
                    </SelectTrigger>
                    <SelectContent>
                      {vets?.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.firstName} {v.paternalLastName} — {v.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Tipo de servicio *</Label>
                <Select value={form.serviceType} onValueChange={(v) => actualizar("serviceType", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="diagnosis">Diagnóstico *</Label>
                <Textarea
                  id="diagnosis"
                  required
                  value={form.diagnosis}
                  onChange={(e) => actualizar("diagnosis", e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="treatment">Tratamiento *</Label>
                <Textarea
                  id="treatment"
                  required
                  value={form.treatment}
                  onChange={(e) => actualizar("treatment", e.target.value)}
                  className="min-h-24"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="externalExams">Exámenes externos (opcional)</Label>
              <Textarea
                id="externalExams"
                value={form.externalExams}
                onChange={(e) => actualizar("externalExams", e.target.value)}
                className="min-h-12"
              />
            </div>

            <ConsumedMedicationsField items={medications} onChange={setMedicamentos} />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="weight">Peso actual (kg, opcional)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => actualizar("weight", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultationFee">Monto de consulta (Bs.) *</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.consultationFee}
                  onChange={(e) => actualizar("consultationFee", e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={crearAtencion.isPending}>
              {crearAtencion.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar atención
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
