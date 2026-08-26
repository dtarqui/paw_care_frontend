import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { Pagination } from "@/components/Pagination";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [showInactive, setShowInactive] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = usePets(page, PAGE_SIZE, showInactive);
  const navigate = useNavigate();

  const pets = useMemo(() => {
    if (!data?.pets) return data?.pets;
    const term = search.trim().toLowerCase();
    if (!term) return data.pets;
    return data.pets.filter((m) => m.name.toLowerCase().includes(term));
  }, [data?.pets, search]);

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="mostrar-inactivas" checked={showInactive} onCheckedChange={setShowInactive} />
              <Label htmlFor="mostrar-inactivas" className="text-sm font-normal text-muted-foreground">
                Mostrar inactivas
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={5} />}

          {isError && <ErrorState message="No se pudo cargar el listado de mascotas. Intenta de nuevo." />}

          {!isLoading && !isError && pets?.length === 0 && (
            <EmptyState
              icon={PawPrint}
              title={search ? "Ninguna mascota coincide con la búsqueda" : "Sin mascotas registradas todavía"}
              description={
                search
                  ? "Prueba con otro nombre, o revisa si está marcada como inactiva."
                  : "Registrá la primera mascota junto con los datos de su propietario."
              }
              action={search ? undefined : <NewPetDialog />}
            />
          )}

          {!isLoading && !isError && pets && pets.length > 0 && (
            <>
              <MobileCardList>
                {pets.map((pet) => (
                  <MobileCard
                    key={pet.id}
                    title={pet.name}
                    subtitle={`${pet.species}${pet.breed ? ` · ${pet.breed}` : ""}`}
                    badge={
                      pet.status === "INACTIVE" ? (
                        <Badge variant="secondary" className="border-none font-normal">
                          Inactiva
                        </Badge>
                      ) : undefined
                    }
                    rows={[
                      { label: "Sexo", value: pet.sex },
                      { label: "Peso", value: <span className="tabular-nums">{pet.weight} kg</span> },
                      { label: "Propietario", value: `${pet.owner.firstName} ${pet.owner.paternalLastName}` },
                    ]}
                    onClick={() => navigate(`/app/pets/${pet.id}`)}
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Especie</TableHead>
                      <TableHead>Raza</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead>Propietario</TableHead>
                      {showInactive && <TableHead>Estado</TableHead>}
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
                        {showInactive && (
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
              </DesktopTable>
              {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
