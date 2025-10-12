import { create } from "zustand";
import User from "../type/User";
import { getCurrentUserAction } from "../action/userAction";

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  fetchCurrentUser: () => Promise<void>;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // State
  currentUser: null,
  isLoading: false,
  error: null,

  // Actions - notice how simple set() is!
  setCurrentUser: (user) => set({ currentUser: user }),

  fetchCurrentUser: async () => {
    console.log("🔵 fetchCurrentUser called!"); // Add this
    set({ isLoading: true });
    try {
      const response = await getCurrentUserAction();
      console.log("useUserStore : ", response);
      set({ currentUser: response.data, isLoading: false });
    } catch (error) {
      console.log("❌ Error:", error);
      set({ error: "Failed to fetch user", isLoading: false });
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
}));
