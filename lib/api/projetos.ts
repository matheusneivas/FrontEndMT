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

    const response = await apiClient.get<PaginatedResponse<Projeto>>(
      `/projetos?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Projeto> => {
    const response = await apiClient.get<Projeto>(`/projetos/${id}`);
    return response.data;
  },

  create: async (data: CreateProjetoRequest): Promise<Projeto> => {
    const response = await apiClient.post<Projeto>('/projetos', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjetoRequest): Promise<Projeto> => {
    const response = await apiClient.patch<Projeto>(`/projetos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projetos/${id}`);
  },

  getMeusProjetos: async (): Promise<Projeto[]> => {
    const response = await apiClient.get<Projeto[]>('/projetos/meus');
    return response.data;
  },
};

export default projetosApi;
