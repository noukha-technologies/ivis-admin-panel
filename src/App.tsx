import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router';
import { Toaster } from 'sonner';

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
      if (e.key === 'auth_token') {
        if (!e.newValue) {
          window.location.href = '/login';
        } else if (window.location.pathname === '/login') {
          window.location.href = '/dashboard';
        }
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