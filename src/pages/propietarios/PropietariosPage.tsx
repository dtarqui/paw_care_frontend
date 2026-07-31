import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePropietarios } from "@/features/propietarios/usePropietarios";
import { Users } from "lucide-react";
import { EditarPropietarioDialog } from "./EditarPropietarioDialog";

export function PropietariosPage() {
  const { data: propietarios, isLoading, isError } = usePropietarios();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Propietarios</h1>
        <p className="text-muted-foreground">Registro y gestión de dueños de mascotas</p>
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
            <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el listado de propietarios.</p>
          )}

          {!isLoading && !isError && propietarios?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="size-8" />
              <p>Sin propietarios registrados todavía.</p>
            </div>
          )}

          {!isLoading && !isError && propietarios && propietarios.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Mascotas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propietarios.map((propietario) => (
                    <TableRow key={propietario.id}>
                      <TableCell className="font-medium">
                        {propietario.nombre} {propietario.apellidoPaterno}
                      </TableCell>
                      <TableCell>{propietario.ci}</TableCell>
                      <TableCell>{propietario.telefono || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="border-none font-normal">
                          {propietario.cantidadMascotas}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <EditarPropietarioDialog propietario={propietario} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
