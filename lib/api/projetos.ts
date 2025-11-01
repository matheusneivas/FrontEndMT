import apiClient from './client';
import type {
  Projeto,
  CreateProjetoRequest,
  UpdateProjetoRequest,
  PaginatedResponse,
  ProjetoFilters,
} from '../types';

export const projetosApi = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: ProjetoFilters
  ): Promise<PaginatedResponse<Projeto>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.tipo_fluxo && { tipo_fluxo: filters.tipo_fluxo }),
      ...(filters?.clienteId && { clienteId: filters.clienteId }),
      ...(filters?.advogadoId && { advogadoId: filters.advogadoId }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await apiClient.get(`/projetos?${params.toString()}`);

    // Verificar estrutura da resposta
    if (response.data.data && Array.isArray(response.data.data)) {
      // Se data é array direto
      return {
        data: response.data.data,
        total: response.data.meta?.total || response.data.data.length,
        page: response.data.meta?.page || page,
        limit: response.data.meta?.limit || limit,
        totalPages: response.data.meta?.totalPages || 1,
      };
    } else if (response.data.data?.data && Array.isArray(response.data.data.data)) {
      // Se data está aninhado
      return {
        data: response.data.data.data,
        total: response.data.data.meta.total,
        page: response.data.data.meta.page,
        limit: response.data.data.meta.limit,
        totalPages: response.data.data.meta.totalPages,
      };
    } else {
      console.error('❌ Estrutura de resposta não reconhecida:', response.data);
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    }
  },

  getById: async (id: string): Promise<Projeto> => {
    const response = await apiClient.get<{ data: Projeto }>(`/projetos/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<Projeto> => {
    // Backend espera: clienteId, tipoFluxo (obrigatórios)
    // Opcionais: responsavelId, status, dataInicio, dataPrevisaoConclusao, estrategiaDefinida, observacoes
    const backendData: any = {
      clienteId: data.clienteId,
      tipoFluxo: data.tipo_fluxo,
    };

    // Adicionar campos opcionais
    if (data.advogadoId) backendData.responsavelId = data.advogadoId;

    // Converter datas de YYYY-MM-DD para ISO-8601 DateTime
    if (data.dataInicio) {
      backendData.dataInicio = new Date(data.dataInicio + 'T00:00:00.000Z').toISOString();
    }
    if (data.dataPrevisao) {
      backendData.dataPrevisaoConclusao = new Date(data.dataPrevisao + 'T00:00:00.000Z').toISOString();
    }

    if (data.estrategiaDefinida) backendData.estrategiaDefinida = data.estrategiaDefinida;
    if (data.observacoes) backendData.observacoes = data.observacoes;

    const response = await apiClient.post<{ data: Projeto }>('/projetos', backendData);
    return response.data.data;
  },

  update: async (id: string, data: UpdateProjetoRequest): Promise<Projeto> => {
    const response = await apiClient.patch<{ data: Projeto }>(`/projetos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projetos/${id}`);
  },

  getMeusProjetos: async (): Promise<Projeto[]> => {
    const response = await apiClient.get<{ data: Projeto[] }>('/projetos/meus');
    return response.data.data;
  },
};

export default projetosApi;
