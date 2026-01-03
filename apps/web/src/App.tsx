import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "./app/providers";
import { useAuthInit } from "./features/auth/hooks/useAuthInit";
import { AppRoutes } from "./AppRoutes";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import { ToastProvider } from "./shared/components/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * AppContent
 *
 * Handles auth initialization and renders routes.
 * Auth logic is now delegated to useAuthInit hook.
 */
const AppContent: React.FC = () => {
  const { isGuest, isInitialized } = useAuthInit();
  console.log(
    "[DEBUG] AppContent render. Initialized:",
    isInitialized,
    "Guest:",
    isGuest,
  );

  if (!isInitialized) {
    return <div>Loading Auth...</div>;
  }

  return <AppRoutes isGuest={isGuest} />;
};

/**
 * App
 *
 * Root component providing:
 * - React Query provider
 * - React Router provider
 * - Custom app providers (themes, etc.)
 * - Error boundary
 * - Toast notifications
 *
 * All routing and auth logic is delegated to child modules.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Providers>
            <ToastProvider>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </ToastProvider>
          </Providers>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
