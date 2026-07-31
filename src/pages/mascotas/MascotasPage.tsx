import { Pagination } from "@/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/features/auth/AuthContext";
import { useMascotas } from "@/features/mascotas/useMascotas";
import { PawPrint } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImportarClientesDialog } from "./ImportarClientesDialog";
import { NuevaMascotaDialog } from "./NuevaMascotaDialog";

const PAGE_SIZE = 20;

export function MascotasPage() {
  const { usuario } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useMascotas(page, PAGE_SIZE);
  const mascotas = data?.mascotas;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mascotas</h1>
          <p className="text-muted-foreground">Gestión de mascotas registradas</p>
        </div>
        <div className="flex gap-2">
          {usuario?.rol === "ADMINISTRADOR" && <ImportarClientesDialog />}
          <NuevaMascotaDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Listado</CardTitle>
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

          {!isLoading && !isError && mascotas?.length === 0 && <EmptyState />}

          {!isLoading && !isError && mascotas && mascotas.length > 0 && (
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
                      <TableHead>Propietario</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mascotas.map((mascota) => (
                      <TableRow
                        key={mascota.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/app/mascotas/${mascota.id}`)}
                      >
                        <TableCell className="font-medium">{mascota.nombre}</TableCell>
                        <TableCell>{mascota.especie}</TableCell>
                        <TableCell>{mascota.raza}</TableCell>
                        <TableCell>{mascota.sexo}</TableCell>
                        <TableCell>{mascota.peso} kg</TableCell>
                        <TableCell>
                          {mascota.propietario.nombre} {mascota.propietario.apellidoPaterno}
                        </TableCell>
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
