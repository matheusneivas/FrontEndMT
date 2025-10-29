import apiClient from './client';
import type {
  User,
  PaginatedResponse,
  UserFilters,
} from '../types';

export const usersApi = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.ativo !== undefined && { ativo: filters.ativo.toString() }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await apiClient.get<PaginatedResponse<User>>(
      `/users?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<User>
  ): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

export default usersApi;
