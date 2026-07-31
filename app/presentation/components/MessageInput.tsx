import { useForm } from "react-hook-form";

import { Send } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { type SendMessageInput, sendMessageSchema } from "@/domain/models/message";

import { Button } from "./ui/button";
import { Field, FieldContent, FieldError } from "./ui/field";
import { Input } from "./ui/input";

interface MessageInputProps {
  onSendMessage: (data: SendMessageInput) => void;
  onTyping: () => void;
  onBlur: () => void;
  isPending?: boolean;
}

export function MessageInput({ onSendMessage, onTyping, onBlur, isPending }: MessageInputProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
  });

  const onSubmit = (data: SendMessageInput) => {
    onSendMessage(data);
    reset();
  };

  return (
    <div className="shrink-0 px-4 py-4 border-t border-border">
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
                className="min-h-12 text-base rounded-xl shadow-md focus:shadow-lg border border-border/50"
              />
            </div>
            <FieldError errors={errors.content ? [errors.content] : []} />
          </FieldContent>
        </Field>
        <Button
          type="submit"
          disabled={isPending}
          className="self-end h-12 px-4 rounded-xl bg-(--color-primary-dark) text-white hover:bg-(--color-primary-dark)/80 shadow-md hover:shadow-lg transition-shadow"
        >
          <Send className="size-5" />
        </Button>
      </form>
    </div>
  );
}
