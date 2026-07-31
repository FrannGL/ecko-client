import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/presentation/store/authStore";

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}
