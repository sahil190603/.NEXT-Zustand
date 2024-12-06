import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppThemeStore = create(
  persist(
    (set) => ({
      appthemeData: {
        theme: 'light', 
      },
      
      setTheme: (theme) =>
        set((state) => ({
          appthemeData: { ...state.appthemeData, theme },
        })),
    }),
    {
      name: 'apptheme-storage', 
    }
  )
);

export default useAppThemeStore;
