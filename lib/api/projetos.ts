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

    // Backend wraps response in { data: { data: [], meta: {} }, timestamp, path }
    const response = await apiClient.get<{ data: { data: Projeto[]; meta: any } }>(
      `/projetos?${params.toString()}`
    );

    // Transform backend response to match PaginatedResponse type
    return {
      data: response.data.data.data,
      total: response.data.data.meta.total,
      page: response.data.data.meta.page,
      limit: response.data.data.meta.limit,
      totalPages: response.data.data.meta.totalPages,
    };
  },

  getById: async (id: string): Promise<Projeto> => {
    const response = await apiClient.get<{ data: Projeto }>(`/projetos/${id}`);
    return response.data.data;
  },

  create: async (data: CreateProjetoRequest): Promise<Projeto> => {
    const response = await apiClient.post<{ data: Projeto }>('/projetos', data);
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
