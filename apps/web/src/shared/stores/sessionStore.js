import { create } from 'zustand';
export const useSessionStore = create((set) => ({
    sessionData: null,
    setSessionData: (data) => set({ sessionData: data }),
    updateSessionData: (data) => set((state) => ({
        sessionData: state.sessionData ? { ...state.sessionData, ...data } : data
    })),
    clearSessionData: () => set({ sessionData: null }),
}));
