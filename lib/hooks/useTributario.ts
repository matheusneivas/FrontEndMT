import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as tributarioApi from '../api/tributario';
import type {
  CreateTributarioRequest,
  UpdateTributarioRequest,
  SolicitarImunidadeRequest,
  AtualizarImunidadeRequest,
  EmitirGuiaRequest,
  RegistrarPagamentoRequest,
  ProtocolarDossieRequest,
} from '../types/tributario';

// Hook para buscar tributário de um projeto
export function useTributario(projetoId: string) {
  return useQuery({
    queryKey: ['tributario', projetoId],
    queryFn: () => tributarioApi.getTributarioByProjeto(projetoId),
    enabled: !!projetoId,
    retry: false,
  });
}

// Hook para criar análise tributária
export function useCreateTributario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTributarioRequest) => tributarioApi.createTributario(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Análise tributária criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar análise tributária');
    },
  });
}

// Hook para atualizar análise tributária
export function useUpdateTributario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTributarioRequest }) =>
      tributarioApi.updateTributario(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Análise tributária atualizada');
    },
    onError: () => {
      toast.error('Erro ao atualizar análise tributária');
    },
  });
}

// Hook para solicitar imunidade ITBI
export function useSolicitarImunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & SolicitarImunidadeRequest) =>
      tributarioApi.solicitarImunidade(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Imunidade ITBI solicitada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao solicitar imunidade');
    },
  });
}

// Hook para atualizar status da imunidade
export function useAtualizarImunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      ...payload
    }: {
      id: string;
      status: 'DEFERIDA' | 'INDEFERIDA';
    } & AtualizarImunidadeRequest) => tributarioApi.atualizarImunidade(id, status, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Status da imunidade atualizado');
    },
    onError: () => {
      toast.error('Erro ao atualizar imunidade');
    },
  });
}

// Hook para emitir guia tributária
export function useEmitirGuia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tributarioId, guia }: { tributarioId: string; guia: EmitirGuiaRequest }) =>
      tributarioApi.emitirGuia(tributarioId, guia),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Guia emitida com sucesso');
    },
    onError: () => {
      toast.error('Erro ao emitir guia');
    },
  });
}

// Hook para registrar pagamento de guia
export function useRegistrarPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guiaId, pagamento }: { guiaId: string; pagamento: RegistrarPagamentoRequest }) =>
      tributarioApi.registrarPagamento(guiaId, pagamento),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Pagamento registrado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao registrar pagamento');
    },
  });
}

// Hook para verificar se pode avançar para etapa 7
export function useVerificarPodeAvancar(projetoId: string) {
  return useQuery({
    queryKey: ['pode-avancar', projetoId],
    queryFn: () => tributarioApi.verificarPodeAvancar(projetoId),
    enabled: !!projetoId,
  });
}

// Hook para protocolar dossiê
export function useProtocolarDossie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ProtocolarDossieRequest) =>
      tributarioApi.protocolarDossie(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Dossiê protocolado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao protocolar dossiê');
    },
  });
}

// Hook para atualizar status do dossiê
export function useAtualizarDossie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tributarioApi.atualizarDossie(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tributario', data.projetoId] });
      toast.success('Status do dossiê atualizado');
    },
    onError: () => {
      toast.error('Erro ao atualizar dossiê');
    },
  });
}
