import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { AlertCircle, ArrowRight } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { type LoginInput, loginSchema } from "@/domain/models/auth";
import AuroraBackground from "@/presentation/components/custom/AuroraBackground";
import { Logo } from "@/presentation/components/custom/Logo";
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  Input,
  Spinner,
} from "@/presentation/components/ui";
import { useLogin } from "@/presentation/hooks/useAuth";
import { useAuthStore } from "@/presentation/store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useLogin();
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated && !isNavigating) {
      navigate("/", { replace: true });
    }
  }, []);

  const onSubmit = (data: LoginInput) => {
    setIsNavigating(true);
    login.mutate(data, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
      onError: () => {
        setIsNavigating(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 sm:p-8 overflow-hidden font-body">
      <AuroraBackground />

      {/* Decorative backdrop to mute the aurora slightly behind the main content */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-0" />

      <div className="w-full max-w-105 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Header section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size={64} />
        </div>

        {/* Form Card */}
        <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            <Field orientation="vertical">
              <FieldLabel
                htmlFor="login-email"
                className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5"
              >
                Correo Electrónico
              </FieldLabel>
              <FieldContent>
                <Input
                  id="login-email"
                  type="email"
                  {...register("email")}
                  placeholder="tu@email.com"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl px-4 text-sm font-medium"
                />
                <FieldError errors={errors.email ? [errors.email] : []} />
              </FieldContent>
            </Field>

            <Field orientation="vertical">
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel
                  htmlFor="login-password"
                  className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground"
                >
                  Contraseña
                </FieldLabel>
              </div>
              <FieldContent>
                <Input
                  id="login-password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl px-4 text-sm font-medium"
                />
                <FieldError errors={errors.password ? [errors.password] : []} />
              </FieldContent>
            </Field>

            {login.error && (
              <Alert
                variant="destructive"
                className="mt-4 bg-destructive/10 border-destructive/20 text-destructive rounded-xl"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium ml-2">{login.error.message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!isValid || login.isPending || isNavigating}
              size="lg"
              className="w-full h-12 mt-4 rounded-xl font-display font-medium text-sm tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all group"
            >
              {login.isPending || isNavigating ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <span className="flex items-center justify-center">
                  Iniciar sesión
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-3 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 ease-out">
          {/* <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-foreground hover:text-primary font-medium transition-colors underline decoration-border hover:decoration-primary underline-offset-4"
            >
              Crea una ahora
            </Link>
          </p> */}
          <p className="text-sm text-muted-foreground">
            ¿Tienes un código de invitación?{" "}
            <Link
              to="/join"
              className="text-foreground hover:text-primary font-medium transition-colors underline decoration-border hover:decoration-primary underline-offset-4"
            >
              Únete aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
