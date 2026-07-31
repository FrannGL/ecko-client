import { create } from "zustand";

interface UIState {
  selectedServerId: number | null;
  selectedChannelId: number | null;
  sidebarOpen: boolean;
  setSelectedServer: (id: number | null) => void;
  setSelectedChannel: (id: number | null) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedServerId: null,
  selectedChannelId: null,
  sidebarOpen: true,
  setSelectedServer: (id) => set({ selectedServerId: id, selectedChannelId: null }),
  setSelectedChannel: (id) => set({ selectedChannelId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
