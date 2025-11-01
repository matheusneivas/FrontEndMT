import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ValidarTokenResponse,
  CriarSenhaRequest,
  CriarSenhaResponse
} from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/api/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/profile');
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Client-side logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  validarTokenAtivacao: async (token: string): Promise<ValidarTokenResponse> => {
    const response = await apiClient.post<ValidarTokenResponse>('/auth/validar-token', { token });
    return response.data;
  },

  criarSenhaComToken: async (data: CriarSenhaRequest): Promise<CriarSenhaResponse> => {
    const response = await apiClient.post<CriarSenhaResponse>('/auth/criar-senha', data);
    return response.data;
  },
};

export default authApi;
