import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuscarMascotasPorCi } from "@/features/mascotas/useMascotas";
import type { Mascota } from "@/features/mascotas/types";
import { cn } from "@/lib/utils";
import { PawPrint, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

interface BuscadorMascotaPorCiProps {
  mascotaSeleccionadaId?: number;
  onSeleccionar: (mascota: Mascota) => void;
}

export function BuscadorMascotaPorCi({ mascotaSeleccionadaId, onSeleccionar }: BuscadorMascotaPorCiProps) {
  const [ci, setCi] = useState("");
  const [ciBuscado, setCiBuscado] = useState<string | undefined>();
  const { data: resultados, isFetching, isError } = useBuscarMascotasPorCi(ciBuscado);

  function handleBuscar(event: FormEvent) {
    event.preventDefault();
    setCiBuscado(ci);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleBuscar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="ci-busqueda">CI del propietario</Label>
            <Input id="ci-busqueda" value={ci} onChange={(e) => setCi(e.target.value)} placeholder="Ej. 4521367" />
          </div>
          <Button type="submit" disabled={!ci || isFetching}>
            <Search className="size-4" />
            Buscar
          </Button>
        </form>

        {isFetching && (
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-40" />
          </div>
        )}

        {isError && <p className="mt-4 text-sm text-destructive">No se pudo realizar la búsqueda.</p>}

        {!isFetching && ciBuscado && resultados?.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">No se encontraron mascotas para ese CI.</p>
        )}

        {!isFetching && resultados && resultados.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {resultados.map((mascota) => (
              <button
                key={mascota.id}
                type="button"
                onClick={() => onSeleccionar(mascota)}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  mascotaSeleccionadaId === mascota.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <PawPrint className="size-4" />
                {mascota.nombre} ({mascota.especie})
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
