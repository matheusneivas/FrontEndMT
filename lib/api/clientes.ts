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

    const response = await apiClient.get<PaginatedResponse<Cliente>>(
      `/clientes?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Cliente> => {
    const response = await apiClient.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  create: async (data: CreateClienteRequest): Promise<Cliente> => {
    const response = await apiClient.post<Cliente>('/clientes', data);
    return response.data;
  },

  update: async (id: string, data: UpdateClienteRequest): Promise<Cliente> => {
    const response = await apiClient.patch<Cliente>(`/clientes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clientes/${id}`);
  },
};

export default clientesApi;
