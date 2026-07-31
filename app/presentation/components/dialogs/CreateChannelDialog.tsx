import { Controller, useForm } from "react-hook-form";

import type { UseMutationResult } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import type { Channel, CreateChannelInput } from "@/domain/models";
import { createChannelSchema } from "@/domain/models";
import { Button } from "@/presentation/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateChannelInput) => void;
  mutation: UseMutationResult<Channel, Error, CreateChannelInput>;
}

export function CreateChannelDialog({ open, onOpenChange, onSubmit, mutation }: CreateChannelDialogProps) {
  const form = useForm<CreateChannelInput>({
    resolver: zodResolver(createChannelSchema),
  });

  const handleSubmit = (data: CreateChannelInput) => {
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
          <DialogTitle>Crear Canal</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Nombre</Label>
            <Input id="channel-name" {...form.register("name")} placeholder="general" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-type">Tipo</Label>
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Texto</SelectItem>
                    <SelectItem value="VOICE">Voz</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
