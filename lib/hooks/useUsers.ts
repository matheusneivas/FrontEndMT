import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api';
import type { User, UserFilters } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useUsers(page = 1, limit = 10, filters?: UserFilters) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', page, limit, filters],
    queryFn: () => usersApi.getAll(page, limit, filters),
  });

  return {
    users: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    isLoading,
    error,
    refetch,
  };
}

export function useUser(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });

  return {
    user: data,
    isLoading,
    error,
    refetch,
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.update(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['users', id] });
      const previousUser = queryClient.getQueryData<User>(['users', id]);

      if (previousUser) {
        queryClient.setQueryData<User>(['users', id], {
          ...previousUser,
          ...data,
        });
      }

      return { previousUser };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      toast({
        title: 'Usuário atualizado',
        description: 'Usuário atualizado com sucesso',
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['users', context.previousUser.id], context.previousUser);
      }
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuário excluído',
        description: 'Usuário excluído com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir usuário',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}
