import { cn } from "@/lib/utils";

import { Logo } from "./Logo";

interface LoadingProps {
  label?: string;
  className?: string;
}

export function Loading({ label = "Cargando...", className }: LoadingProps) {
  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Logo size={64} showText={false} />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
