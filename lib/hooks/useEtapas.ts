import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { etapasApi } from '../api';
import type { CreateEtapaRequest, UpdateEtapaRequest, Etapa } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useEtapas(projetoId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['etapas', projetoId],
    queryFn: () => etapasApi.getByProjeto(projetoId),
    enabled: !!projetoId,
  });

  return {
    etapas: data || [],
    isLoading,
    error,
    refetch,
  };
}

export function useEtapa(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['etapas', 'detail', id],
    queryFn: () => etapasApi.getById(id),
    enabled: !!id,
  });

  return {
    etapa: data,
    isLoading,
    error,
    refetch,
  };
}

export function useCreateEtapa() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEtapaRequest) => etapasApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['etapas', data.projetoId] });
      queryClient.invalidateQueries({ queryKey: ['projetos', data.projetoId] });
      toast({
        title: 'Etapa criada',
        description: 'Etapa criada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar etapa',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateEtapa() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEtapaRequest }) =>
      etapasApi.update(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['etapas', 'detail', id] });
      const previousEtapa = queryClient.getQueryData<Etapa>(['etapas', 'detail', id]);

      if (previousEtapa) {
        queryClient.setQueryData<Etapa>(['etapas', 'detail', id], {
          ...previousEtapa,
          ...data,
        });
      }

      return { previousEtapa };
    },
    onSuccess: (updatedEtapa, variables) => {
      queryClient.invalidateQueries({ queryKey: ['etapas', updatedEtapa.projetoId] });
      queryClient.invalidateQueries({ queryKey: ['projetos', updatedEtapa.projetoId] });
      queryClient.invalidateQueries({ queryKey: ['etapas', 'detail', variables.id] });
      toast({
        title: 'Etapa atualizada',
        description: 'Etapa atualizada com sucesso',
      });
    },
    onError: (error: any, _, context) => {
      if (context?.previousEtapa) {
        queryClient.setQueryData(
          ['etapas', 'detail', context.previousEtapa.id],
          context.previousEtapa
        );
      }
      toast({
        title: 'Erro ao atualizar etapa',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteEtapa() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => etapasApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['etapas'] });
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      toast({
        title: 'Etapa excluída',
        description: 'Etapa excluída com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir etapa',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    },
  });
}
