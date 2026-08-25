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
import type { OwnerWithPets } from "@/features/owners/types";
import { useUpdateOwner } from "@/features/owners/useOwners";
import { Loader2, Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

export function EditOwnerDialog({ owner }: { owner: OwnerWithPets }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: owner.firstName,
    paternalLastName: owner.paternalLastName,
    phone: owner.phone,
    address: owner.address ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const actualizarPropietario = useUpdateOwner();

  function handleOpenChange(v: boolean) {
    if (v)
      setForm({
        firstName: owner.firstName,
        paternalLastName: owner.paternalLastName,
        phone: owner.phone,
        address: owner.address ?? "",
      });
    setError(null);
    setOpen(v);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.paternalLastName.trim()) {
      setError("Nombre y apellido paterno no pueden quedar vacíos");
      return;
    }

    try {
      await actualizarPropietario.mutateAsync({
        id: owner.id,
        input: {
          firstName: form.firstName.trim(),
          paternalLastName: form.paternalLastName.trim(),
          phone: form.phone.trim() || undefined,
          address: form.address.trim() || undefined,
        },
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el propietario");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar propietario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>CI</Label>
            <Input value={owner.nationalId} disabled className="bg-muted/40" />
            <p className="text-xs text-muted-foreground">El CI no se puede editar — es la clave usada para buscar al propietario.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPropNombre">Nombre *</Label>
              <Input
                id="editPropNombre"
                required
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPropApellido">Apellido paterno *</Label>
              <Input
                id="editPropApellido"
                required
                value={form.paternalLastName}
                onChange={(e) => setForm((prev) => ({ ...prev, paternalLastName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPropTelefono">Teléfono</Label>
              <Input
                id="editPropTelefono"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPropDireccion">Dirección</Label>
              <Input
                id="editPropDireccion"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={actualizarPropietario.isPending}>
              {actualizarPropietario.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
