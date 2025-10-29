import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesApi } from '../api';
import type {
  CreateClienteRequest,
  UpdateClienteRequest,
  ClienteFilters,
  Cliente,
} from '../types';
import { useToast } from '@/hooks/use-toast';

export function useClientes(page = 1, limit = 10, filters?: ClienteFilters) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clientes', page, limit, filters],
    queryFn: () => clientesApi.getAll(page, limit, filters),
  });

  return {
    clientes: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    isLoading,
    error,
    refetch,
  };
}

export function useCliente(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clientes', id],
    queryFn: () => clientesApi.getById(id),
    enabled: !!id,
  });

  return {
    cliente: data,
    isLoading,
    error,
    refetch,
  };
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateClienteRequest) => clientesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: 'Cliente criado',
        description: 'Cliente criado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar cliente',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClienteRequest }) =>
      clientesApi.update(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['clientes', id] });
      const previousCliente = queryClient.getQueryData<Cliente>(['clientes', id]);

      if (previousCliente) {
        queryClient.setQueryData<Cliente>(['clientes', id], {
          ...previousCliente,
          ...data,
        });
      }

      return { previousCliente };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['clientes', variables.id] });
      toast({
        title: 'Cliente atualizado',
        description: 'Cliente atualizado com sucesso',
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousCliente) {
        queryClient.setQueryData(['clientes', context.previousCliente.id], context.previousCliente);
      }
      toast({
        title: 'Erro ao atualizar cliente',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => clientesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: 'Cliente excluído',
        description: 'Cliente excluído com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir cliente',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}
