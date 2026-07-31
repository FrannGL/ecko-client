import { useEffect, useRef } from "react";

import { toast } from "sonner";

import { useAuthStore } from "@/presentation/store/authStore";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const showLoginToast = useAuthStore((s) => s.showLoginToast);
  const clearLoginToast = useAuthStore((s) => s.clearLoginToast);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (showLoginToast && user && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success(`Bienvenido nuevamente, ${user.username}!`);
      clearLoginToast();
    }
  }, [showLoginToast, user, clearLoginToast]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl text-foreground font-semibold">Bienvenido a Ecko</h1>
        <p className="text-muted-foreground text-sm mt-2">Selecciona un canal para empezar a chatear</p>
      </div>
    </div>
  );
}
