import { useEffect, useRef, useState } from "react";

import { Pause, Play } from "lucide-react";

import { useSignedMediaUrl } from "@/presentation/hooks/useMessages";

interface VoiceMessagePlayerProps {
  channelId: number;
  messageId: number;
  durationMs?: number | null;
  align?: "start" | "end";
}

function formatTime(seconds: number) {
  const clamped = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const secs = clamped % 60;
  const mins = Math.floor(clamped / 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function VoiceMessagePlayer({ channelId, messageId, durationMs, align = "start" }: VoiceMessagePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [metadataDuration, setMetadataDuration] = useState<number | null>(null);
  const { data: mediaUrl, isError } = useSignedMediaUrl(channelId, messageId);

  const totalDuration = metadataDuration ?? (durationMs != null ? durationMs / 1000 : 0);
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (mediaUrl && audioRef.current) {
      audioRef.current.src = mediaUrl;
    }
  }, [mediaUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  if (isError) {
    return (
      <div className="px-4 py-2 rounded-xl bg-muted/60 text-xs text-muted-foreground">
        No se pudo cargar el audio
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 min-w-[220px] border ${
        align === "end" ? "bg-primary/20 border-primary/30" : "bg-muted/40 border-border/40"
      }`}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setMetadataDuration(e.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <button
        type="button"
        onClick={togglePlayback}
        className="shrink-0 size-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 translate-x-[1px]" />}
      </button>

      <div className="flex-1">
        <div className="h-1.5 w-full rounded-full bg-black/15 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </div>
      </div>
    </div>
  );
}