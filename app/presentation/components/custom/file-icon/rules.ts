import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  type LucideIcon,
} from "lucide-react";

export interface IconRule<T> {
  pattern: RegExp;
  value: T;
}

export const FILE_ICON_RULES: IconRule<LucideIcon>[] = [
  { pattern: /^image\//, value: FileImage },
  { pattern: /^video\//, value: FileVideo },
  { pattern: /^audio\//, value: FileAudio },
  { pattern: /json/, value: FileJson },
  {
    pattern: /(^|\/)(x-)?(javascript|typescript|html?|css|xml|sql|sh|bash|python|java|go|rust|yaml|yml|toml)/,
    value: FileCode,
  },
  { pattern: /excel|spreadsheet|ms-excel|opendocument\.spreadsheet|^text\/csv/, value: FileSpreadsheet },
  { pattern: /msword|wordprocessingml|opendocument\.text/, value: FileText },
  { pattern: /powerpoint|presentationml|ms-powerpoint|opendocument\.presentation/, value: FileType },
  { pattern: /pdf/, value: FileText },
  { pattern: /zip|rar|7z|tar|gzip|compress|archive/, value: FileArchive },
];

export const CUSTOM_SVG_RULES: IconRule<string>[] = [
  { pattern: /^image\/jpe?g$|^image\/pjpeg/, value: "/assets/icons/jpg.svg" },
  { pattern: /^image\/png$/, value: "/assets/icons/png.svg" },
  { pattern: /^application\/json$|^text\/json$|\+json$/, value: "/assets/icons/json.svg" },
  { pattern: /^application\/pdf$/, value: "/assets/icons/pdf.svg" },
  { pattern: /msword|wordprocessingml|officedocument\.wordprocessingml|opendocument\.text/, value: "/assets/icons/word.svg" },
  { pattern: /ms-excel|spreadsheetml|officedocument\.spreadsheetml|opendocument\.spreadsheet|^text\/csv/, value: "/assets/icons/excel.svg" },
  { pattern: /^text\/plain$|^text\/txt/, value: "/assets/icons/txt.svg" },
];

export const DEFAULT_FILE_ICON: LucideIcon = File;
