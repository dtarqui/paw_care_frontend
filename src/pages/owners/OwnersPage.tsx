import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOwners } from "@/features/owners/useOwners";
import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EditOwnerDialog } from "./EditOwnerDialog";

export function OwnersPage() {
  const { data: owners, isLoading, isError } = useOwners();
  const [busqueda, setBusqueda] = useState("");

  const propietariosFiltrados = useMemo(() => {
    if (!owners) return owners;
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return owners;
    return owners.filter(
      (p) => `${p.firstName} ${p.paternalLastName}`.toLowerCase().includes(termino) || p.nationalId.toLowerCase().includes(termino)
    );
  }, [owners, busqueda]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Propietarios</h1>
        <p className="text-muted-foreground">Registro y gestión de dueños de mascotas</p>
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Listado</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o CI..."
              className="w-64 pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
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
            <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el listado de propietarios.</p>
          )}

          {!isLoading && !isError && owners?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="size-8" />
              <p>Sin propietarios registrados todavía.</p>
            </div>
          )}

          {!isLoading && !isError && propietariosFiltrados && propietariosFiltrados.length > 0 && (
            <div className="overflow-x-auto">
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
                  {propietariosFiltrados.map((owner) => (
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
            </div>
          )}

          {!isLoading && !isError && owners && owners.length > 0 && propietariosFiltrados?.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Ningún propietario coincide con la búsqueda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
