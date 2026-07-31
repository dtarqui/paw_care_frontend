import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/features/auth/AuthContext";
import { useCambiarEstadoUsuario, useUsuarios } from "@/features/usuarios/useUsuarios";
import type { Usuario } from "@/features/usuarios/types";
import { ROL_LABEL } from "@/lib/roles";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import { CambiarRolDialog } from "./CambiarRolDialog";
import { NuevoUsuarioDialog } from "./NuevoUsuarioDialog";

const PAGE_SIZE = 20;

export function UsuariosPage() {
  const { usuario: usuarioActual } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsuarios(page, PAGE_SIZE);
  const usuarios = data?.usuarios;
  const [objetivo, setObjetivo] = useState<Usuario | null>(null);
  const [objetivoRol, setObjetivoRol] = useState<Usuario | null>(null);
  const cambiarEstado = useCambiarEstadoUsuario();

  async function confirmar() {
    if (!objetivo) return;
    const nuevoEstado = objetivo.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    await cambiarEstado.mutateAsync({ id: objetivo.id, estado: nuevoEstado });
    setObjetivo(null);
  }

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
            <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>CI</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
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
                      <TableCell className="text-right space-x-2">
                        {usuario.id !== usuarioActual?.id && (
                          <Button variant="outline" size="sm" onClick={() => setObjetivoRol(usuario)}>
                            Cambiar rol
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setObjetivo(usuario)}>
                          {usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                        </Button>
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

      <Dialog open={!!objetivo} onOpenChange={(v) => !v && setObjetivo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{objetivo?.estado === "ACTIVO" ? "¿Desactivar cuenta?" : "¿Activar cuenta?"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {objetivo?.estado === "ACTIVO"
              ? `${objetivo?.nombre} ${objetivo?.apellidoPaterno} ya no podrá iniciar sesión, y dejará de aparecer en los selectores de veterinario para agendar o atender.`
              : `${objetivo?.nombre} ${objetivo?.apellidoPaterno} podrá volver a iniciar sesión.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setObjetivo(null)}>
              Cancelar
            </Button>
            <Button
              variant={objetivo?.estado === "ACTIVO" ? "destructive" : "default"}
              onClick={confirmar}
              disabled={cambiarEstado.isPending}
            >
              {cambiarEstado.isPending && <Loader2 className="size-4 animate-spin" />}
              {objetivo?.estado === "ACTIVO" ? "Desactivar" : "Activar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CambiarRolDialog usuario={objetivoRol} onClose={() => setObjetivoRol(null)} />
    </div>
  );
}
