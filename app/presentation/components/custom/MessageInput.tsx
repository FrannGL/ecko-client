import { useState } from "react";
import { useForm } from "react-hook-form";

import { Mic, Send } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { type SendMessageInput, sendMessageSchema } from "@/domain/models/message";

import { Button } from "../ui/button";
import { Field, FieldContent, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AudioRecordDialog } from "./dialogs/AudioRecordDialog";

interface MessageInputProps {
  onSendMessage: (data: SendMessageInput) => void;
  onSendAudio: (file: Blob, durationMs: number) => void;
  onTyping: () => void;
  onBlur: () => void;
  isPending?: boolean;
}

export function MessageInput({ onSendMessage, onSendAudio, onTyping, onBlur, isPending }: MessageInputProps) {
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
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
  const isButtonDisabled = isPending || !content?.trim();

  const onSubmit = (data: SendMessageInput) => {
    onSendMessage(data);
    reset();
  };

  return (
    <>
      <div className="shrink-0 px-4 py-4 border-t border-border/50 bg-background/30 backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-end">
          <Field className="flex-1" orientation="vertical">
            <FieldContent>
              <div className="relative">
                <Input
                  {...register("content")}
                  onInput={onTyping}
                  onBlur={onBlur}
                  placeholder="Escribe tu mensaje..."
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
