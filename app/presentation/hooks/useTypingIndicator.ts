import { useEffect, useRef, useState } from "react";

import { sendMessage as sendWsMessage, subscribeToTopic } from "@/data/websocket/stompClient";

export function useTypingIndicator(channelId: number, userId: number | undefined) {
  const [typingUsers, setTypingUsers] = useState<Map<number, string>>(new Map());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const userNameMapRef = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    const typingSub = subscribeToTopic(`/topic/channel/${channelId}/typing`, (msg: { body: string }) => {
      const data = JSON.parse(msg.body);
      if (data.userId === userId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (data.isTyping) {
          const name = userNameMapRef.current.get(data.userId) ?? `User ${data.userId}`;
          next.set(data.userId, name);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    return () => typingSub.unsubscribe();
  }, [channelId, userId]);

  const handleTyping = () => {
    sendWsMessage(`/app/chat.typing/${channelId}`, { isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendWsMessage(`/app/chat.typing/${channelId}`, { isTyping: false });
    }, 2000);
  };

  const stopTyping = () => {
    clearTimeout(typingTimeoutRef.current);
    sendWsMessage(`/app/chat.typing/${channelId}`, { isTyping: false });
  };

  const setUserNameMap = (map: Map<number, string>) => {
    userNameMapRef.current = map;
  };

  return {
    typingUsers,
    handleTyping,
    stopTyping,
    setUserNameMap,
  };
}
