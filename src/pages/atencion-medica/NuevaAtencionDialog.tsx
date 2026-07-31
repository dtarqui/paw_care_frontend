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
import { useAuth } from "@/features/auth/AuthContext";
import { useCrearAtencion } from "@/features/atenciones/useAtenciones";
import type { Mascota } from "@/features/mascotas/types";
import { useMiVeterinario } from "@/features/veterinarios/useMiVeterinario";
import { useVeterinarios } from "@/features/veterinarios/useVeterinarios";
import { TIPOS_SERVICIO } from "@/lib/tipos-servicio";
import { Loader2, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { MedicamentosConsumidosField, type ItemMedicamento } from "./MedicamentosConsumidosField";

const ESTADO_INICIAL = {
  veterinarioId: "",
  tipoServicio: "",
  diagnostico: "",
  tratamiento: "",
  examenesExternos: "",
  peso: "",
  montoConsulta: "",
};

export function NuevaAtencionDialog({ mascota }: { mascota: Mascota }) {
  const { usuario } = useAuth();
  const esVeterinario = usuario?.rol === "VETERINARIO";
  const { data: veterinarios, isLoading: cargandoVeterinarios } = useVeterinarios(true);
  const { miVeterinario } = useMiVeterinario();
  const crearAtencion = useCrearAtencion();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [medicamentos, setMedicamentos] = useState<ItemMedicamento[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (esVeterinario && miVeterinario && !form.veterinarioId) {
      setForm((prev) => ({ ...prev, veterinarioId: String(miVeterinario.id) }));
    }
  }, [esVeterinario, miVeterinario, form.veterinarioId]);

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(campo: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleClose() {
    setForm(esVeterinario && miVeterinario ? { ...ESTADO_INICIAL, veterinarioId: String(miVeterinario.id) } : ESTADO_INICIAL);
    setMedicamentos([]);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.veterinarioId) {
      setError("Selecciona el veterinario que atiende");
      return;
    }
    if (!form.tipoServicio) {
      setError("Selecciona el tipo de servicio");
      return;
    }
    if (!form.diagnostico.trim() || !form.tratamiento.trim()) {
      setError("Diagnóstico y tratamiento son obligatorios");
      return;
    }

    const medicamentosValidos = medicamentos
      .filter((m) => m.medicamentoId && Number(m.cantidad) > 0)
      .map((m) => ({ medicamentoId: Number(m.medicamentoId), cantidad: Number(m.cantidad) }));

    try {
      await crearAtencion.mutateAsync({
        mascotaId: mascota.id,
        veterinarioId: Number(form.veterinarioId),
        tipoServicio: form.tipoServicio,
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
        examenesExternos: form.examenesExternos || undefined,
        peso: form.peso ? Number(form.peso) : undefined,
        montoConsulta: Number(form.montoConsulta) || 0,
        medicamentos: medicamentosValidos.length > 0 ? medicamentosValidos : undefined,
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Nueva atención — {mascota.nombre} ({mascota.especie})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Veterinario *</Label>
              {esVeterinario ? (
                <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
                  <ShieldCheck className="size-4 shrink-0 text-primary" />
                  <span className="truncate">
                    {miVeterinario ? `${miVeterinario.nombre} ${miVeterinario.apellidoPaterno}` : "Cargando…"}
                  </span>
                  <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
                    Tú
                  </Badge>
                </div>
              ) : (
                <Select value={form.veterinarioId} onValueChange={(v) => actualizar("veterinarioId", v)} disabled={cargandoVeterinarios}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarios?.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.nombre} {v.apellidoPaterno} — {v.especialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Tipo de servicio *</Label>
              <Select value={form.tipoServicio} onValueChange={(v) => actualizar("tipoServicio", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_SERVICIO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="diagnostico">Diagnóstico *</Label>
            <textarea
              id="diagnostico"
              required
              value={form.diagnostico}
              onChange={(e) => actualizar("diagnostico", e.target.value)}
              className="min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tratamiento">Tratamiento *</Label>
            <textarea
              id="tratamiento"
              required
              value={form.tratamiento}
              onChange={(e) => actualizar("tratamiento", e.target.value)}
              className="min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="examenesExternos">Exámenes externos (opcional)</Label>
            <textarea
              id="examenesExternos"
              value={form.examenesExternos}
              onChange={(e) => actualizar("examenesExternos", e.target.value)}
              className="min-h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <MedicamentosConsumidosField items={medicamentos} onChange={setMedicamentos} />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="peso">Peso actual (kg, opcional)</Label>
              <Input
                id="peso"
                type="number"
                min="0"
                step="0.1"
                value={form.peso}
                onChange={(e) => actualizar("peso", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="montoConsulta">Monto de consulta (Bs.) *</Label>
              <Input
                id="montoConsulta"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.montoConsulta}
                onChange={(e) => actualizar("montoConsulta", e.target.value)}
              />
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
