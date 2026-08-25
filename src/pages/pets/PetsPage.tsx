import { Pagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/features/auth/AuthContext";
import { usePets } from "@/features/pets/usePets";
import { PawPrint, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImportClientsDialog } from "./ImportClientsDialog";
import { NewPetDialog } from "./NewPetDialog";

const PAGE_SIZE = 20;

export function PetsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [mostrarInactivas, setMostrarInactivas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { data, isLoading, isError } = usePets(page, PAGE_SIZE, mostrarInactivas);
  const navigate = useNavigate();

  const pets = useMemo(() => {
    if (!data?.pets) return data?.pets;
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return data.pets;
    return data.pets.filter((m) => m.name.toLowerCase().includes(termino));
  }, [data?.pets, busqueda]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mascotas</h1>
          <p className="text-muted-foreground">Gestión de mascotas registradas</p>
        </div>
        <div className="flex gap-2">
          {user?.role === "ADMIN" && <ImportClientsDialog />}
          <NewPetDialog />
        </div>
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Listado</CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                className="w-56 pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="mostrar-inactivas" checked={mostrarInactivas} onCheckedChange={setMostrarInactivas} />
              <Label htmlFor="mostrar-inactivas" className="text-sm font-normal text-muted-foreground">
                Mostrar inactivas
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">
              No se pudo cargar el listado de mascotas. Intenta de nuevo.
            </p>
          )}

          {!isLoading && !isError && pets?.length === 0 && <EmptyState />}

          {!isLoading && !isError && pets && pets.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead>Owner</TableHead>
                      {mostrarInactivas && <TableHead>Estado</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow
                        key={pet.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/app/pets/${pet.id}`)}
                      >
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell>{pet.species}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.sex}</TableCell>
                        <TableCell>{pet.weight} kg</TableCell>
                        <TableCell>
                          {pet.owner.firstName} {pet.owner.paternalLastName}
                        </TableCell>
                        {mostrarInactivas && (
                          <TableCell>
                            {pet.status === "INACTIVE" && (
                              <Badge variant="secondary" className="border-none font-normal">
                                Inactiva
                              </Badge>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
      <PawPrint className="size-8" />
      <p>Sin mascotas registradas todavía.</p>
    </div>
  );
}
