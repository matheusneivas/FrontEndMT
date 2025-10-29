import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization Bearer token from NextAuth
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    } catch (error) {
      console.error('Error getting session:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (401, 403, 500)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        await signOut({ redirect: true, callbackUrl: '/auth/login' });
        break;

      case 403:
        // Forbidden - toast error
        if (typeof window !== 'undefined') {
          // Dynamic import to avoid SSR issues
          const { toast } = await import('@/hooks/use-toast');
          toast({
            title: 'Acesso negado',
            description: error.response?.data?.message || 'Você não tem permissão para acessar este recurso',
            variant: 'destructive',
          });
        }
        break;

      case 500:
        // Server error - toast generic error
        if (typeof window !== 'undefined') {
          const { toast } = await import('@/hooks/use-toast');
          toast({
            title: 'Erro no servidor',
            description: error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            variant: 'destructive',
          });
        }
        break;

      default:
        // Other errors - toast generic error if in browser
        if (typeof window !== 'undefined' && status >= 400) {
          const { toast } = await import('@/hooks/use-toast');
          toast({
            title: 'Erro',
            description: error.response?.data?.message || 'Ocorreu um erro. Tente novamente.',
            variant: 'destructive',
          });
        }
        break;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
