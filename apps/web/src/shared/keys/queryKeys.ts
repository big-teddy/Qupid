export const queryKeys = {
    user: {
        all: ["user"] as const,
        profile: (userId?: string) => [...queryKeys.user.all, "profile", userId] as const,
        me: () => [...queryKeys.user.all, "me"] as const,
    },
    chat: {
        all: ["chat"] as const,
        session: (sessionId: string) => [...queryKeys.chat.all, "session", sessionId] as const,
        history: (userId: string) => [...queryKeys.chat.all, "history", userId] as const,
    },
    coaching: {
        all: ["coaching"] as const,
        coaches: () => [...queryKeys.coaching.all, "coaches"] as const,
        coach: (id: string) => [...queryKeys.coaching.all, "coach", id] as const,
        session: (sessionId: string) => [...queryKeys.coaching.all, "session", sessionId] as const,
        dashboard: (userId: string) => [...queryKeys.coaching.all, "dashboard", userId] as const,
    },
    onboarding: {
        all: ["onboarding"] as const,
        status: (userId: string) => [...queryKeys.onboarding.all, "status", userId] as const,
    },
};
