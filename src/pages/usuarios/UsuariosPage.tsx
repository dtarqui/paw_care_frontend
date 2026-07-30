import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { useUsuarios } from "@/features/usuarios/useUsuarios";
import { ROL_LABEL } from "@/lib/roles";
import { Users } from "lucide-react";
import { NuevoUsuarioDialog } from "./NuevoUsuarioDialog";

export function UsuariosPage() {
  const { data: usuarios, isLoading, isError } = useUsuarios();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Registro y gestión de cuentas del sistema</p>
        </div>
        <NuevoUsuarioDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el listado de usuarios.</p>}

          {!isLoading && !isError && usuarios?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Users className="size-8" />
              <p>Sin usuarios registrados todavía.</p>
            </div>
          )}

          {!isLoading && !isError && usuarios && usuarios.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nombre} {usuario.apellidoPaterno}
                      </TableCell>
                      <TableCell>{usuario.ci}</TableCell>
                      <TableCell>{usuario.username}</TableCell>
                      <TableCell>{ROL_LABEL[usuario.rol]}</TableCell>
                      <TableCell>
                        <StatusBadge status={usuario.estado} />
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
