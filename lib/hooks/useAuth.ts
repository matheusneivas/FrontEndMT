import { useSession, signIn, signOut } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { useAuthStore } from '../stores/auth-store';
import type { RegisterRequest } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuário registrado',
        description: 'Usuário registrado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao registrar usuário',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });

  const handleLogin = async (email: string, senha: string) => {
    try {
      console.log('🔵 useAuth - Chamando signIn...', { email });
      const result = await signIn('credentials', {
        email,
        senha,
        redirect: false,
      });

      console.log('🔵 useAuth - Resultado signIn:', result);

      if (result?.error) {
        console.error('❌ useAuth - Erro no signIn:', result.error);
        toast({
          title: 'Erro no login',
          description: 'Email ou senha inválidos',
          variant: 'destructive',
        });
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        console.log('✅ useAuth - Login OK');
        toast({
          title: 'Login realizado',
          description: 'Bem-vindo!',
        });
        return { success: true };
      }

      console.log('⚠️ useAuth - Resultado inesperado');
      return { success: false };
    } catch (error) {
      console.error('❌ useAuth - Exception:', error);
      toast({
        title: 'Erro no login',
        description: 'Ocorreu um erro ao fazer login',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  };

  const handleLogout = async () => {
    storeLogout();
    queryClient.clear();
    await signOut({ redirect: true, callbackUrl: '/auth/login' });
  };

  return {
    user: session?.user || null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    perfil: session?.user?.role || null,
    login: handleLogin,
    logout: handleLogout,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  };
}
