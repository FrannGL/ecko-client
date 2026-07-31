import { useEffect, useState } from "react";

import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: "default" | "success" | "info" | "warning" | "error";
  duration?: number;
}

let toastCount = 0;
const listeners: Set<(toasts: Toast[]) => void> = new Set();
let toasts: Toast[] = [];

function notify(listeners: Set<(toasts: Toast[]) => void>) {
  listeners.forEach((listener) => listener([...toasts]));
}

function addToast(toast: Omit<Toast, "id">) {
  const id = `toast-${++toastCount}`;
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration ?? 3000,
  };

  toasts.push(newToast);
  notify(listeners);

  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }

  return id;
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify(listeners);
}

function closeAll() {
  toasts = [];
  notify(listeners);
}

export const toast = {
  add: addToast,
  remove: removeToast,
  closeAll,
  success: (title: string, description?: string) => addToast({ title, description, type: "success" }),
  error: (title: string, description?: string) => addToast({ title, description, type: "error" }),
  info: (title: string, description?: string) => addToast({ title, description, type: "info" }),
  warning: (title: string, description?: string) => addToast({ title, description, type: "warning" }),
};

export function useToastState() {
  const [displayToasts, setDisplayToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.add(setDisplayToasts);
    setDisplayToasts([...toasts]);
    return () => {
      listeners.delete(setDisplayToasts);
    };
  }, []);

  return displayToasts;
}

function getToastIcon(type?: string) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
}

function getToastStyles(type?: string) {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900";
    case "error":
      return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900";
    case "warning":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900";
    case "info":
      return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900";
    default:
      return "bg-background border-border";
  }
}

export function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div
      className={`flex gap-3 p-2.5 rounded-lg border ${getToastStyles(toast.type)} animate-in fade-in slide-in-from-right-2 duration-300 fade-out slide-out-to-right-2`}
    >
      <div className="shrink-0">{getToastIcon(toast.type)}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-sm font-medium text-foreground">{toast.title}</p>}
        {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
