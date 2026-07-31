import { Client, type IMessage } from "@stomp/stompjs";

let client: Client | null = null;

type SubEntry = {
  topic: string;
  callback: (msg: IMessage) => void;
  sub?: { unsubscribe: () => void };
};

const subs: SubEntry[] = [];
const pendingMessages: Array<{ destination: string; body: string }> = [];

function ensureClient(): Client {
  if (!client) {
    client = new Client({
      brokerURL: "ws://localhost:8081/ws",
      reconnectDelay: 5000,
      beforeConnect: () => {
        const token = localStorage.getItem("accessToken");
        if (client) {
          client.connectHeaders = { Authorization: `Bearer ${token ?? ""}` };
        }
      },
      onConnect: () => {
        for (const entry of subs) {
          if (!entry.sub) {
            entry.sub = client!.subscribe(entry.topic, entry.callback as any) as any;
          }
        }
        for (const msg of pendingMessages) {
          client?.publish({ destination: msg.destination, body: msg.body });
        }
        pendingMessages.length = 0;
      },
      onStompError: () => {},
    });
  }
  return client;
}

export function connectStomp() {
  const c = ensureClient();
  if (!c.active) {
    c.activate();
  }
}

export function disconnectStomp() {
  if (client?.connected) {
    client.deactivate();
  }
  subs.length = 0;
  pendingMessages.length = 0;
}

export function subscribeToTopic(topic: string, callback: (msg: IMessage) => void) {
  const c = ensureClient();
  const entry: SubEntry = { topic, callback };

  if (c.connected) {
    entry.sub = c.subscribe(topic, callback as any) as any;
  }

  subs.push(entry);

  return {
    unsubscribe: () => {
      entry.sub?.unsubscribe();
      const idx = subs.indexOf(entry);
      if (idx !== -1) subs.splice(idx, 1);
    },
  };
}

export function sendMessage(destination: string, body: object) {
  const c = ensureClient();
  const payload = JSON.stringify(body);
  if (c.connected) {
    c.publish({ destination, body: payload });
  } else {
    pendingMessages.push({ destination, body: payload });
  }
}
