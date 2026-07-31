import { useRoutes } from "react-router-dom";

import { Toaster } from "sonner";

import { ErrorBoundary } from "./presentation/components/ErrorBoundary";
import { AppProviders } from "./presentation/providers/AppProviders";
import { routes } from "./presentation/router";

export function App() {
  const routeElements = useRoutes(routes);

  return (
    <AppProviders>
      <ErrorBoundary>{routeElements}</ErrorBoundary>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "6px",
          },
        }}
      />
    </AppProviders>
  );
}
