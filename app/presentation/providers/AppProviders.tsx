import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/presentation/components/ui";

import { AuthProvider } from "./AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // More conservative retry strategy - only retry on network errors, not server errors
      retry: (failureCount, error) => {
        // Don't retry on 4xx or 5xx errors
        if (error instanceof Error && error.message?.includes("HTTP")) {
          return false;
        }
        // Only retry up to 2 times for network errors
        return failureCount < 2;
      },
      staleTime: 30000,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
