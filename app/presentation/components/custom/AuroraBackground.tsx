export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.62 0.19 240 / 0.16), transparent)",
        }}
      />
      <div
        className="aurora-blob absolute left-[-20%] top-[-15%] h-[65vmax] w-[65vmax] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle at 40% 40%, oklch(0.6 0.2 300 / 0.5), transparent 62%)",
          filter: "blur(90px)",
          animation: "aurora-drift-1 24s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob absolute right-[-25%] top-[-5%] h-[60vmax] w-[60vmax] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle at 60% 30%, oklch(0.62 0.19 240 / 0.55), transparent 62%)",
          filter: "blur(100px)",
          animation: "aurora-drift-2 28s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob absolute bottom-[-30%] left-[10%] h-[70vmax] w-[70vmax] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, oklch(0.78 0.14 205 / 0.45), transparent 60%)",
          filter: "blur(100px)",
          animation: "aurora-drift-3 26s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob absolute bottom-[-10%] right-[-10%] h-[55vmax] w-[55vmax] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, oklch(0.55 0.2 280 / 0.5), transparent 60%)",
          filter: "blur(110px)",
          animation: "aurora-drift-4 32s ease-in-out infinite",
        }}
      />
    </div>
  );
}
