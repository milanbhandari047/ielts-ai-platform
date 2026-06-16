// store/leaderboard.store.ts

import { create } from "zustand";
import { leaderboardService } from "@/services/leaderboard.service";
import type { LeaderboardEntry, MyRank } from "@/types/leaderboard";

interface LeaderboardState {
  // Data
  entries: LeaderboardEntry[];
  myRank: MyRank | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null; // epoch ms — used to avoid re-fetching within 60s

  // Actions
  fetchLeaderboard: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

const CACHE_TTL = 60_000; // 60 seconds

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  entries: [],
  myRank: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchLeaderboard: async () => {
    const { isLoading, lastFetched } = get();

    // Avoid duplicate in-flight requests
    if (isLoading) return;

    // Serve from cache if fetched within TTL
    if (lastFetched && Date.now() - lastFetched < CACHE_TTL) return;

    set({ isLoading: true, error: null });

    try {
      const [entries, myRank] = await Promise.all([
        leaderboardService.getWeekly(),
        leaderboardService.getMyRank(),
      ]);

      set({
        entries,
        myRank,
        isLoading: false,
        lastFetched: Date.now(),
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load leaderboard.",
      });
    }
  },

  // Force refresh — bypasses cache
  refresh: async () => {
    set({ lastFetched: null });
    await get().fetchLeaderboard();
  },

  reset: () =>
    set({
      entries: [],
      myRank: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));
