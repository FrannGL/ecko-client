import type { OrbSize } from "thinking-orbs";
import { ThinkingOrb } from "thinking-orbs";

interface LogoProps {
  size?: OrbSize;
  showText?: boolean;
}

export function Logo({ size = 64, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <ThinkingOrb state="working" size={size} />
      {showText && <span className="font-space-grotesk font-bold text-4xl text-foreground hidden sm:inline">Ecko</span>}
    </div>
  );
}
