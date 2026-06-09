import { create } from "zustand";
import type { AiTutorMessage, AiTutorSessionListItem } from "@/types";

interface AiTutorState {
  sessions: AiTutorSessionListItem[];
  currentSessionId: string | null;
  messages: AiTutorMessage[];
  isStreaming: boolean;
  streamingContent: string;
  isLoadingSessions: boolean;
  isLoadingMessages: boolean;

  setSessions: (sessions: AiTutorSessionListItem[]) => void;
  addSession: (session: AiTutorSessionListItem) => void;
  removeSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  setMessages: (messages: AiTutorMessage[]) => void;
  addMessage: (message: AiTutorMessage) => void;
  setStreaming: (v: boolean) => void;
  appendStreamChunk: (chunk: string) => void;
  commitStreamedMessage: () => void;
  setLoadingSessions: (v: boolean) => void;
  setLoadingMessages: (v: boolean) => void;
  resetChat: () => void;
}

export const useAiTutorStore = create<AiTutorState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  messages: [],
  isStreaming: false,
  streamingContent: "",
  isLoadingSessions: false,
  isLoadingMessages: false,

  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((s) => ({ sessions: [session, ...s.sessions] })),
  removeSession: (sessionId) =>
    set((s) => ({ sessions: s.sessions.filter((s) => s.id !== sessionId) })),
  setCurrentSession: (currentSessionId) =>
    set({ currentSessionId, messages: [], streamingContent: "" }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setStreaming: (isStreaming) => set({ isStreaming, streamingContent: "" }),
  appendStreamChunk: (chunk) =>
    set((s) => ({ streamingContent: s.streamingContent + chunk })),
  commitStreamedMessage: () => {
    const { streamingContent, messages } = get();
    if (!streamingContent.trim()) return;
    const msg: AiTutorMessage = {
      role: "assistant",
      content: streamingContent,
      createdAt: new Date().toISOString(),
    };
    set({
      messages: [...messages, msg],
      streamingContent: "",
      isStreaming: false,
    });
  },
  setLoadingSessions: (isLoadingSessions) => set({ isLoadingSessions }),
  setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),
  resetChat: () =>
    set({
      currentSessionId: null,
      messages: [],
      streamingContent: "",
      isStreaming: false,
    }),
}));
