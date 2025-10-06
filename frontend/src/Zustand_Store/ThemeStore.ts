'use client';

import { create } from 'zustand';

interface ThemeState {
  primaryAccentColor: string;
  secondaryAccentColor: string;
  setPrimaryAccentColor: (color: string) => void;
  setSecondaryAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryAccentColor: '#f5f5f5',
  secondaryAccentColor: '#FFD166',
  setPrimaryAccentColor: (color: string) => set({ primaryAccentColor: color }),
  setSecondaryAccentColor: (color: string) => set({ secondaryAccentColor: color }),
}));

export default useThemeStore;


