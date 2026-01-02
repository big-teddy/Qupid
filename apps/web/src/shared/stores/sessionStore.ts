import { create } from 'zustand';
import { ConversationAnalysis, Persona, AICoach, ConversationMode } from '@qupid/core';
import { Scenario } from '../../features/coaching/data/scenarios';

interface SessionData {
    persona?: Persona;
    partner?: Persona | AICoach;
    isTutorial?: boolean;
    isCoaching?: boolean;
    conversationMode?: ConversationMode;
    scenario?: Scenario;
    analysis?: ConversationAnalysis;
    tutorialCompleted?: boolean;
}

interface SessionState {
    sessionData: SessionData | null;
    setSessionData: (data: SessionData | null) => void;
    updateSessionData: (data: Partial<SessionData>) => void;
    clearSessionData: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionData: null,
    setSessionData: (data) => set({ sessionData: data }),
    updateSessionData: (data) => set((state) => ({
        sessionData: state.sessionData ? { ...state.sessionData, ...data } : data as SessionData
    })),
    clearSessionData: () => set({ sessionData: null }),
}));
