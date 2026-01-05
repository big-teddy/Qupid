export const queryKeys = {
    user: {
        all: ["user"],
        profile: (userId) => [...queryKeys.user.all, "profile", userId],
        me: () => [...queryKeys.user.all, "me"],
    },
    chat: {
        all: ["chat"],
        session: (sessionId) => [...queryKeys.chat.all, "session", sessionId],
        history: (userId) => [...queryKeys.chat.all, "history", userId],
    },
    coaching: {
        all: ["coaching"],
        coaches: () => [...queryKeys.coaching.all, "coaches"],
        coach: (id) => [...queryKeys.coaching.all, "coach", id],
        session: (sessionId) => [...queryKeys.coaching.all, "session", sessionId],
        dashboard: (userId) => [...queryKeys.coaching.all, "dashboard", userId],
    },
    onboarding: {
        all: ["onboarding"],
        status: (userId) => [...queryKeys.onboarding.all, "status", userId],
    },
};
