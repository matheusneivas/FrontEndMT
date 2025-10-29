import apiClient from './client';
import type {
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
  PaginatedResponse,
  ClienteFilters,
} from '../types';

export const clientesApi = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: ClienteFilters
  ): Promise<PaginatedResponse<Cliente>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });

    // Backend wraps response in { data: { data: [], meta: {} }, timestamp, path }
    const response = await apiClient.get<{ data: { data: Cliente[]; meta: any } }>(
      `/clientes?${params.toString()}`
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

  getById: async (id: string): Promise<Cliente> => {
    const response = await apiClient.get<{ data: Cliente }>(`/clientes/${id}`);
    return response.data.data;
  },

  create: async (data: CreateClienteRequest): Promise<Cliente> => {
    const response = await apiClient.post<{ data: Cliente }>('/clientes', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateClienteRequest): Promise<Cliente> => {
    const response = await apiClient.patch<{ data: Cliente }>(`/clientes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clientes/${id}`);
  },
};

export default clientesApi;
