import type { ReactNode } from "react";

import { Button } from "../ui/button";

interface ErrorBoundaryProps {
  children?: ReactNode;
  error?: Error | null;
}

export function ErrorBoundary({ children, error }: ErrorBoundaryProps) {
  if (!error) {
    return children;
  }

  let message = "¡Vaya!";
  let details = "Ocurrió un error inesperado.";
  let stack: string | undefined;
  let isAuthError = false;

  if (error instanceof Error) {
    details = error.message;
    stack = error.stack;

    if (details.includes("403") || details.includes("Forbidden") || details.includes("unauthorized")) {
      message = "Sesión expirada";
      details = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      isAuthError = true;
    } else if (details.includes("404")) {
      message = "No encontrado";
      details = "La página o recurso que buscas no existe.";
    } else if (details.includes("5") || details.includes("Server error") || details.includes("Internal")) {
      message = "Error del servidor";
      details = "El servidor está teniendo problemas. Intenta más tarde.";
    } else if (details.includes("Network") || details.includes("fetch")) {
      message = "Error de conexión";
      details = "No se pudo conectar al servidor. Verifica tu conexión a internet.";
    }
  }

  const handleRetry = () => {
    window.location.href = isAuthError ? "/login" : "/";
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-4">
          <div>
            <h1 className="font-display text-3xl text-foreground font-semibold tracking-tight mb-2">{message}</h1>
            <p className="text-muted-foreground">{details}</p>
          </div>

          {stack && (
            <details className="mt-6">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                Detalles técnicos
              </summary>
              <pre className="mt-2 w-full overflow-x-auto text-xs text-muted-foreground font-mono bg-muted p-3 rounded-md">
                <code>{stack}</code>
              </pre>
            </details>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleRetry} className="flex-1">
              {isAuthError ? "Ir a login" : "Reintentar"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/")}>
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
