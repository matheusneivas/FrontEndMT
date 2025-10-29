import apiClient from './client';
import type {
  Etapa,
  CreateEtapaRequest,
  UpdateEtapaRequest,
} from '../types';

export const etapasApi = {
  getByProjeto: async (projetoId: string): Promise<Etapa[]> => {
    const response = await apiClient.get<Etapa[]>(`/projetos/${projetoId}/etapas`);
    return response.data;
  },

  getById: async (id: string): Promise<Etapa> => {
    const response = await apiClient.get<Etapa>(`/etapas/${id}`);
    return response.data;
  },

  create: async (data: CreateEtapaRequest): Promise<Etapa> => {
    const response = await apiClient.post<Etapa>('/etapas', data);
    return response.data;
  },

  update: async (id: string, data: UpdateEtapaRequest): Promise<Etapa> => {
    const response = await apiClient.patch<Etapa>(`/etapas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/etapas/${id}`);
  },
};

export default etapasApi;
