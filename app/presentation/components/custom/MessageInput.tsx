import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

import { Mic, Paperclip, Send, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { type SendMessageInput, sendMessageSchema } from "@/domain/models/message";
import type { SendFileMessageInput } from "@/domain/models/message";
import { FileIcon } from "@/presentation/components/custom/file-icon/file-icon";

import { Button } from "../ui/button";
import { Field, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AudioRecordDialog } from "./dialogs/AudioRecordDialog";

interface MessageInputProps {
  onSendMessage: (data: SendMessageInput) => void;
  onSendAudio: (file: Blob, durationMs: number) => void;
  onSendFile: (data: SendFileMessageInput) => void;
  onTyping: () => void;
  onBlur: () => void;
  isPending?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessageInput({ onSendMessage, onSendAudio, onSendFile, onTyping, onBlur, isPending }: MessageInputProps) {
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
  });

  const content = watch("content");
  const hasContent = !!content?.trim();
  const hasFiles = pendingFiles.length > 0;
  const isButtonDisabled = isPending || (!hasContent && !hasFiles);

  const onSubmit = (data: SendMessageInput) => {
    if (hasFiles) {
      for (const file of pendingFiles) {
        onSendFile({ file, content: data.content || undefined });
      }
      setPendingFiles([]);
      reset();
    } else {
      onSendMessage(data);
      reset();
    }
  };

  const handleSubmitWithFiles = () => {
    if (hasFiles && !hasContent) {
      for (const file of pendingFiles) {
        onSendFile({ file });
      }
      setPendingFiles([]);
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addFiles = (files: File[]) => {
    setPendingFiles((prev) => [...prev, ...files]);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      addFiles(acceptedFiles);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleFileSelect = useCallback(
    (accept: string) => {
      const fileInput = fileInputRef.current;
      if (!fileInput) return;

      fileInput.accept = accept;
      fileInput.value = "";

      const handleChange = () => {
        const files = Array.from(fileInput.files || []);
        if (files.length > 0) {
          addFiles(files);
        }
        fileInput.removeEventListener("change", handleChange);
      };

      fileInput.addEventListener("change", handleChange);
      fileInput.click();
    },
    []
  );

  return (
    <>
      <div
        className="shrink-0 px-4 py-4 border-t border-border/50 bg-background/30 backdrop-blur-md transition-colors relative"
        {...getRootProps()}
      >
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none z-50">
            <p className="text-primary font-medium">Suelta los archivos aqui</p>
          </div>
        )}

        {hasFiles && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {pendingFiles.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const previewUrl = isImage ? URL.createObjectURL(file) : null;

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="relative flex items-center gap-2 shrink-0 rounded-lg border border-border/50 bg-background/80 px-3 py-2 pr-8 max-w-[200px]"
                >
                  {isImage && previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="size-10 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <FileIcon mediaType={file.type} className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePendingFile(index)}
                    className="absolute top-1 right-1 p-0.5 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="size-3 text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (hasFiles && !hasContent) {
              handleSubmitWithFiles();
            } else {
              handleSubmit(onSubmit)(e);
            }
          }}
          className="flex gap-3 items-end"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleFileSelect("image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt")}
                className="h-12 w-12 rounded-xl hover:bg-primary/10 transition-colors"
                disabled={isPending}
              >
                <Paperclip className="size-5 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adjuntar archivo</TooltipContent>
          </Tooltip>

          <Field className="flex-1" orientation="vertical">
            <FieldContent>
              <div className="relative">
                <Input
                  {...register("content")}
                  onInput={onTyping}
                  onBlur={onBlur}
                  placeholder={hasFiles ? "Agrega un mensaje (opcional)..." : "Escribe tu mensaje o arrastra archivos..."}
                  disabled={isPending}
                  autoComplete="off"
                  className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 transition-all rounded-xl px-4 text-sm font-medium shadow-sm"
                />
              </div>
              {content?.trim() && <FieldError errors={errors.content ? [errors.content] : []} />}
            </FieldContent>
          </Field>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setAudioDialogOpen(true)}
                className="h-12 w-12 rounded-xl hover:bg-primary/10 transition-colors"
                disabled={isPending}
              >
                <Mic className="size-5 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grabar audio</TooltipContent>
          </Tooltip>

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className="self-end h-12 px-5 rounded-xl font-medium tracking-wide bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground shadow-lg shadow-primary/20 transition-all group"
          >
            <Send className="size-5 opacity-80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </form>

        <input ref={fileInputRef} type="file" hidden />
      </div>

      <AudioRecordDialog
        open={audioDialogOpen}
        onOpenChange={setAudioDialogOpen}
        onSendAudio={onSendAudio}
        isPending={isPending}
      />
    </>
  );
}
