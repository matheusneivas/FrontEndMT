import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projetosApi } from '../api';
import type {
  CreateProjetoRequest,
  UpdateProjetoRequest,
  ProjetoFilters,
  Projeto,
} from '../types';
import { useToast } from '@/hooks/use-toast';

export function useProjetos(page = 1, limit = 10, filters?: ProjetoFilters) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projetos', page, limit, filters],
    queryFn: () => projetosApi.getAll(page, limit, filters),
  });

  return {
    projetos: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    isLoading,
    error,
    refetch,
  };
}

export function useProjeto(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projetos', id],
    queryFn: () => projetosApi.getById(id),
    enabled: !!id,
  });

  return {
    projeto: data,
    isLoading,
    error,
    refetch,
  };
}

export function useProjetoTimeline(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projetos', id, 'timeline'],
    queryFn: () => projetosApi.getById(id),
    enabled: !!id,
    select: (data) => ({
      ...data,
      atividades: data.atividades?.filter(a => a.status === 'VISIVEL_CLIENTE') || [],
    }),
  });

  return {
    projeto: data,
    atividades: data?.atividades || [],
    isLoading,
    error,
    refetch,
  };
}

export function useMeusProjetos() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['meus-projetos'],
    queryFn: () => projetosApi.getMeusProjetos(),
  });

  return {
    projetos: data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useCreateProjeto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProjetoRequest) => projetosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      queryClient.invalidateQueries({ queryKey: ['meus-projetos'] });
      toast({
        title: 'Projeto criado',
        description: 'Projeto criado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar projeto',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProjeto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjetoRequest }) =>
      projetosApi.update(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['projetos', id] });
      const previousProjeto = queryClient.getQueryData<Projeto>(['projetos', id]);

      if (previousProjeto) {
        queryClient.setQueryData<Projeto>(['projetos', id], {
          ...previousProjeto,
          ...data,
        });
      }

      return { previousProjeto };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      queryClient.invalidateQueries({ queryKey: ['projetos', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['meus-projetos'] });
      toast({
        title: 'Projeto atualizado',
        description: 'Projeto atualizado com sucesso',
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousProjeto) {
        queryClient.setQueryData(['projetos', context.previousProjeto.id], context.previousProjeto);
      }
      toast({
        title: 'Erro ao atualizar projeto',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProjeto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => projetosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      queryClient.invalidateQueries({ queryKey: ['meus-projetos'] });
      toast({
        title: 'Projeto excluído',
        description: 'Projeto excluído com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir projeto',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}
