import { useEffect, useRef, useState } from "react";

import { Mic, Square, Trash2 } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui";

const MAX_RECORDING_SECONDS = 60;

interface AudioRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendAudio: (file: Blob, durationMs: number) => void;
  isPending?: boolean;
}

export function AudioRecordDialog({ open, onOpenChange, onSendAudio, isPending }: AudioRecordDialogProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= MAX_RECORDING_SECONDS) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      audioBlobRef.current = null;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const type = audioChunksRef.current[0]?.type || mediaRecorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type });
        audioBlobRef.current = audioBlob;
        setAudioUrl(URL.createObjectURL(audioBlob));
        cleanupStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);
    } catch (err) {
      setError("No se pudo acceder al micrófono. Por favor verifica los permisos.");
      console.error("Error al acceder al micrófono:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    audioBlobRef.current = null;
    setAudioUrl(null);
    setRecordingTime(0);
    setError(null);
  };

  const sendAudio = () => {
    if (audioBlobRef.current && audioUrl) {
      onSendAudio(audioBlobRef.current, recordingTime * 1000);
      discardRecording();
      onOpenChange(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !isRecording) {
          discardRecording();
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grabar mensaje de audio</DialogTitle>
          <DialogDescription>
            {isRecording
              ? "Grabando tu mensaje..."
              : audioUrl
                ? "Reproduce o descarta tu grabación"
                : "Haz clic en grabar para comenzar"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {error && (
            <div className="w-full p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {isRecording && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-pulse">
                <Mic className="size-12 text-primary" />
              </div>
              <p className="text-lg font-semibold text-primary">{formatTime(recordingTime)}</p>
              <p className="text-xs text-muted-foreground">Máximo 60 segundos</p>
            </div>
          )}

          {audioUrl && !isRecording && (
            <div className="flex flex-col items-center gap-4 w-full">
              <audio src={audioUrl} controls className="w-full" />
              <p className="text-sm text-muted-foreground">Duración: {formatTime(recordingTime)}</p>
            </div>
          )}

          {!isRecording && !audioUrl && (
            <p className="text-sm text-muted-foreground">Presiona el botón para comenzar a grabar</p>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <div className="flex gap-2">
            {!isRecording && audioUrl && (
              <Button type="button" variant="destructive" size="sm" onClick={discardRecording} className="gap-2">
                <Trash2 className="size-4" />
                Descartar
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {isRecording && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={stopRecording}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                <Square className="size-4" />
                Detener
              </Button>
            )}

            {!isRecording && !audioUrl && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={startRecording}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Mic className="size-4" />
                Grabar
              </Button>
            )}

            {!isRecording && audioUrl && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={sendAudio}
                disabled={isPending}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Enviar
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
