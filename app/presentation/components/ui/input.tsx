import type { ComponentProps } from "react";

import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

interface InputProps extends ComponentProps<"input"> {
  glass?: boolean;
}

function Input({ className, type, glass, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "pl-3 h-10 w-full min-w-0 rounded-lg border border-input bg-surface text-base transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:bg-surface-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 dark:aria-invalid:border-destructive/70 dark:aria-invalid:ring-destructive/30",
        glass &&
          "bg-white/8 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 focus-visible:bg-white/12 focus-visible:border-accent focus-visible:ring-accent/40 focus-visible:shadow-lg focus-visible:shadow-accent/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
