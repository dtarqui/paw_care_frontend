import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { StatTile } from "@/components/StatTile";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOwners } from "@/features/owners/useOwners";
import { PawPrint, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EditOwnerDialog } from "./EditOwnerDialog";

export function OwnersPage() {
  const { data: owners, isLoading, isError } = useOwners();
  const [search, setSearch] = useState("");

  const filteredOwners = useMemo(() => {
    if (!owners) return owners;
    const term = search.trim().toLowerCase();
    if (!term) return owners;
    return owners.filter(
      (p) => `${p.firstName} ${p.paternalLastName}`.toLowerCase().includes(term) || p.nationalId.toLowerCase().includes(term)
    );
  }, [owners, search]);

  const totalPets = owners?.reduce((sum, o) => sum + o.pets.length, 0) ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Propietarios</h1>
        <p className="text-muted-foreground">Registro y gestión de dueños de mascotas</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatTile label="Propietarios registrados" value={owners?.length ?? 0} icon={Users} isLoading={isLoading} />
        <StatTile label="Mascotas a su cargo" value={totalPets} icon={PawPrint} isLoading={isLoading} />
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Listado</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o CI..."
              className="w-64 pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={5} />}

          {isError && <ErrorState message="No se pudo cargar el listado de propietarios." />}

          {!isLoading && !isError && owners?.length === 0 && (
            <EmptyState
              icon={Users}
              title="Sin propietarios registrados todavía"
              description="Los propietarios se crean al registrar su primera mascota, desde la pantalla de Mascotas."
            />
          )}

          {!isLoading && !isError && filteredOwners && filteredOwners.length > 0 && (
            <>
              <MobileCardList>
                {filteredOwners.map((owner) => (
                  <MobileCard
                    key={owner.id}
                    title={`${owner.firstName} ${owner.paternalLastName}`}
                    subtitle={`CI ${owner.nationalId}`}
                    badge={<EditOwnerDialog owner={owner} />}
                    rows={[
                      { label: "Teléfono", value: owner.phone || "—" },
                      { label: "Dirección", value: owner.address || "—" },
                      {
                        label: "Mascotas",
                        value:
                          owner.pets.length === 0 ? (
                            "—"
                          ) : (
                            <div className="flex flex-wrap justify-end gap-1">
                              {owner.pets.map((pet) => (
                                <Link key={pet.id} to={`/app/pets/${pet.id}`}>
                                  <Badge variant="secondary" className="border-none font-normal">
                                    {pet.name}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          ),
                      },
                    ]}
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Mascotas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">
                        {owner.firstName} {owner.paternalLastName}
                      </TableCell>
                      <TableCell>{owner.nationalId}</TableCell>
                      <TableCell>{owner.phone || "—"}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-muted-foreground">{owner.address || "—"}</TableCell>
                      <TableCell>
                        {owner.pets.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {owner.pets.map((pet) => (
                              <Link key={pet.id} to={`/app/pets/${pet.id}`}>
                                <Badge
                                  variant="secondary"
                                  className="border-none font-normal transition-colors hover:bg-primary/15 hover:text-primary"
                                >
                                  {pet.name}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <EditOwnerDialog owner={owner} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </DesktopTable>
            </>
          )}

          {!isLoading && !isError && owners && owners.length > 0 && filteredOwners?.length === 0 && (
            <EmptyState
              icon={Search}
              title="Ningún propietario coincide con la búsqueda"
              description="Prueba con otro nombre o con el número de CI completo."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
