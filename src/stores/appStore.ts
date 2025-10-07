import { create } from 'zustand';
import type { UserData, Reading } from '../types';

interface AppState {
  currentUser: UserData | null;
  allUsersData: UserData[];
  lastReading: number;
  selectedFile: File | null;

  // Actions
  setCurrentUser: (user: UserData | null) => void;
  setAllUsersData: (data: UserData[]) => void;
  setLastReading: (reading: number) => void;
  setSelectedFile: (file: File | null) => void;
  updateUserReading: (reading: Reading) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  allUsersData: [],
  lastReading: 0,
  selectedFile: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  setAllUsersData: (data) => set({ allUsersData: data }),

  setLastReading: (reading) => set({ lastReading: reading }),

  setSelectedFile: (file) => set({ selectedFile: file }),

  updateUserReading: (reading) =>
    set((state) => {
      if (!state.currentUser) return state;

      const existingIndex = state.currentUser.readings.findIndex(
        (r) => r.month.toLowerCase() === reading.month.toLowerCase(),
      );

      const newReadings = [...state.currentUser.readings];
      if (existingIndex > -1) {
        newReadings[existingIndex] = reading;
      } else {
        newReadings.push(reading);
      }

      return {
        currentUser: {
          ...state.currentUser,
          readings: newReadings,
        },
      };
    }),

  logout: () =>
    set({
      currentUser: null,
      lastReading: 0,
      selectedFile: null,
    }),
}));
