import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router';
import { Toaster } from 'sonner';
import { resolveLandingRoute } from './utils/landingRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue) {
        window.location.href = '/login';
        return;
      }
      if (
        (e.key === 'auth_token' || e.key === 'auth_permissions') &&
        e.newValue &&
        window.location.pathname === '/login'
      ) {
        window.location.href = resolveLandingRoute();
      }
      if (e.key === 'auth_permissions') {
        window.dispatchEvent(new Event('ivis-auth-session-updated'));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster
        position="top-right"
        richColors
        invert
        duration={3000}
        toastOptions={{
          style: {
            width: '380px',
            minHeight: '60px',
            padding: '16px 20px',
            borderRadius: '16px',
            fontSize: '15px',
          }
        }}
      />
    </QueryClientProvider>
  );
}

export default App;