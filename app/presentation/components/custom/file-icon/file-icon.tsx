import { type LucideIcon } from "lucide-react";

import { CUSTOM_SVG_RULES, DEFAULT_FILE_ICON, FILE_ICON_RULES } from "./rules";

/**
 * Get the appropriate fallback Lucide icon based on a MIME type.
 * @param mediaType MIME type (e.g., "application/pdf", "image/png")
 * @returns Lucide icon component
 */
export function getFileIcon(mediaType: string | null): LucideIcon {
  if (!mediaType) return DEFAULT_FILE_ICON;

  const type = mediaType.toLowerCase();
  const rule = FILE_ICON_RULES.find(({ pattern }) => pattern.test(type));

  return rule?.value ?? DEFAULT_FILE_ICON;
}

interface FileIconProps {
  mediaType: string | null;
  className?: string;
}

/**
 * File icon that renders a branded SVG when available, falling back to a
 * Lucide icon otherwise.
 */
export function FileIcon({ mediaType, className }: FileIconProps) {
  if (mediaType) {
    const type = mediaType.toLowerCase();
    const custom = CUSTOM_SVG_RULES.find(({ pattern }) => pattern.test(type));

    if (custom) {
      return <img src={custom.value} alt="" className={className} />;
    }
  }

  const Icon = getFileIcon(mediaType);
  return <Icon className={className} />;
}
