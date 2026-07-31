import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { ArrowRight, CheckCircle2, KeyRound, Loader2 } from "lucide-react";

import AuroraBackground from "@/presentation/components/custom/AuroraBackground";
import { Logo } from "@/presentation/components/custom/Logo";
import { Alert, AlertDescription, Button, Field, FieldContent, FieldLabel, Input } from "@/presentation/components/ui";
import { useGetInviteCodeDetails, useRegisterWithInvite } from "@/presentation/hooks/useRegisterWithInvite";

export default function JoinWithCodePage() {
  const [code, setCode] = useState("");
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { registerWithInvite } = useRegisterWithInvite();
  const {
    data: inviteDetails,
    isLoading: isLoadingInvite,
    error: inviteError,
  } = useGetInviteCodeDetails(code, isCodeValidated);

  const handleValidateCode = (e: FormEvent) => {
    e.preventDefault();
    if (code.length < 3) return;
    setIsCodeValidated(true);
  };

  const handleSubmitRegistration = (e: FormEvent) => {
    e.preventDefault();

    if (!inviteDetails?.code) return;

    registerWithInvite.mutate({
      code: inviteDetails.code,
      username,
      email,
      password,
    });
  };

  // Step 1: Show code validation form
  if (!isCodeValidated || !inviteDetails) {
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
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

            <form onSubmit={handleValidateCode} className="space-y-6 relative z-10">
              <Field orientation="vertical">
                <FieldLabel
                  htmlFor="join-code"
                  className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5"
                >
                  Código de invitación
                </FieldLabel>
                <FieldContent className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <Input
                    id="join-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ej: xYz123"
                    className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl pl-10 pr-4 text-sm font-medium tracking-widest uppercase"
                    maxLength={10}
                    disabled={isLoadingInvite}
                  />
                </FieldContent>
              </Field>

              {isLoadingInvite && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validando código...
                </div>
              )}

              {inviteError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {inviteError instanceof Error ? inviteError.message : "Error al validar código"}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={code.length < 3 || isLoadingInvite}
                size="lg"
                className="w-full h-12 mt-4 rounded-xl font-display font-medium text-sm tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all group"
              >
                <span className="flex items-center justify-center">
                  Validar código
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 ease-out">
            <p className="text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-foreground hover:text-primary font-medium transition-colors underline decoration-border hover:decoration-primary underline-offset-4"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show registration form with server details
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 sm:p-8 overflow-hidden font-body">
      <AuroraBackground />

      {/* Decorative backdrop */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-0" />

      <div className="w-full max-w-105 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Header section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size={64} />
        </div>

        {/* Server details card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Te vas a unir a</p>
              <p className="text-lg font-semibold text-foreground">{inviteDetails.serverName}</p>
            </div>
          </div>
        </div>

        {/* Registration form card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

          <form onSubmit={handleSubmitRegistration} className="space-y-5 relative z-10">
            {/* Username */}
            <Field orientation="vertical">
              <FieldLabel
                htmlFor="username"
                className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5"
              >
                Nombre de usuario
              </FieldLabel>
              <FieldContent>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej: usuario123"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl px-4 text-sm"
                  disabled={registerWithInvite.isPending}
                  required
                  minLength={3}
                  maxLength={50}
                />
              </FieldContent>
            </Field>

            {/* Email */}
            <Field orientation="vertical">
              <FieldLabel
                htmlFor="email"
                className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5"
              >
                Correo electrónico
              </FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej: usuario@ejemplo.com"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl px-4 text-sm"
                  disabled={registerWithInvite.isPending}
                  required
                />
              </FieldContent>
            </Field>

            {/* Password */}
            <Field orientation="vertical">
              <FieldLabel
                htmlFor="password"
                className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5"
              >
                Contraseña
              </FieldLabel>
              <FieldContent>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl px-4 text-sm"
                  disabled={registerWithInvite.isPending}
                  required
                  minLength={6}
                  maxLength={100}
                />
              </FieldContent>
            </Field>

            {registerWithInvite.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {registerWithInvite.error instanceof Error
                    ? registerWithInvite.error.message
                    : "Error al registrarse"}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={
                !username ||
                !email ||
                !password ||
                registerWithInvite.isPending ||
                username.length < 3 ||
                password.length < 6
              }
              size="lg"
              className="w-full h-12 mt-6 rounded-xl font-display font-medium text-sm tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all group"
            >
              {registerWithInvite.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Crear cuenta y unirse
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150 ease-out">
          <p className="text-sm text-muted-foreground">
            <Link
              to="/login"
              className="text-foreground hover:text-primary font-medium transition-colors underline decoration-border hover:decoration-primary underline-offset-4"
            >
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
