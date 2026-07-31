import { useForm } from "react-hook-form";

import type { UseMutationResult } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import type { CreateServerInput, Server } from "@/domain/models";
import { createServerSchema } from "@/domain/models";
import { Button } from "@/presentation/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

interface CreateServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateServerInput) => void;
  mutation: UseMutationResult<Server, Error, CreateServerInput>;
}

export function CreateServerDialog({ open, onOpenChange, onSubmit, mutation }: CreateServerDialogProps) {
  const form = useForm<CreateServerInput>({
    resolver: zodResolver(createServerSchema),
  });

  const handleSubmit = (data: CreateServerInput) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Servidor</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server-name">Nombre</Label>
            <Input id="server-name" {...form.register("name")} placeholder="Mi Servidor" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-desc">Descripción (opcional)</Label>
            <Input id="server-desc" {...form.register("description")} placeholder="Un lugar para amigos" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-icon">URL de Ícono (opcional)</Label>
            <Input id="server-icon" {...form.register("iconUrl")} placeholder="https://ejemplo.com/icono.png" />
          </div>

          {mutation.error && <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
