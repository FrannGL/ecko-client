import { useState } from "react";

import { LogOut } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui";

interface LogoutDialogProps {
  onLogout: () => void;
}

export function LogoutDialog({ onLogout }: LogoutDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon"
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl bg-(--color-muted-dark) text-white hover:bg-red-600 hover:shadow-[0_0_15px_2px_rgba(239,68,68,0.5)] transition-all duration-200"
          >
            <LogOut size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Cerrar sesión</TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder a Ecko.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 text-primary-foreground hover:bg-red-700 hover:shadow-[0_0_5px_1px_rgba(239,68,68,0.6)] transition-all duration-200"
          >
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
