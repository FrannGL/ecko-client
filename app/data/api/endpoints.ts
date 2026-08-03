export const ENDPOINTS = {
  auth: {
    login: "api/auth/login",
    refresh: "api/auth/refresh",
    logout: "api/auth/logout",
    me: "api/auth/me",
    registerInvite: "api/auth/register-invite",
    invite: (code: string) => `api/auth/invite/${code}`,
  },
  servers: {
    list: "api/servers",
    byId: (id: number) => `api/servers/${id}`,
    create: "api/servers",
    update: (id: number) => `api/servers/${id}`,
    delete: (id: number) => `api/servers/${id}`,
    inviteCode: (id: number) => `api/servers/${id}/invite`,
    joinByInviteCode: (code: string) => `api/servers/invite/${code}`,
    channels: (serverId: number) => `api/servers/${serverId}/channels`,
    createChannel: (serverId: number) => `api/servers/${serverId}/channels`,
    activeUsers: (serverId: number, channelId: number) =>
      `api/servers/${serverId}/channels/${channelId}/active-users`,
  },
  channels: {
    byId: (id: number) => `api/channels/${id}`,
    update: (id: number) => `api/channels/${id}`,
    delete: (id: number) => `api/channels/${id}`,
    messages: (channelId: number) => `api/channels/${channelId}/messages`,
    audioMessage: (channelId: number) => `api/channels/${channelId}/messages/audio`,
    media: (channelId: number, messageId: number) =>
      `api/channels/${channelId}/messages/${messageId}/media`,
    reactions: (channelId: number, messageId: number) =>
      `api/channels/${channelId}/messages/${messageId}/reactions`,
  },
} as const;

export const STOMP_TOPICS = {
  sendMessage: (channelId: number) => `/app/chat.sendMessage/${channelId}`,
  messages: (channelId: number) => `/user/queue/messages/${channelId}`,
} as const;