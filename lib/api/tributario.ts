import { apiClient } from './client';
import type {
  Tributario,
  CreateTributarioRequest,
  UpdateTributarioRequest,
  SolicitarImunidadeRequest,
  AtualizarImunidadeRequest,
  EmitirGuiaRequest,
  RegistrarPagamentoRequest,
  ProtocolarDossieRequest,
  PodeAvancarResponse,
} from '../types/tributario';

// Buscar tributário por projeto
export async function getTributarioByProjeto(projetoId: string): Promise<Tributario> {
  const { data } = await apiClient.get<Tributario>(`/tributario/projeto/${projetoId}`);
  return data;
}

// Criar análise tributária
export async function createTributario(payload: CreateTributarioRequest): Promise<Tributario> {
  const { data } = await apiClient.post<Tributario>('/tributario', payload);
  return data;
}

// Atualizar análise tributária
export async function updateTributario(id: string, payload: UpdateTributarioRequest): Promise<Tributario> {
  const { data } = await apiClient.patch<Tributario>(`/tributario/${id}`, payload);
  return data;
}

// Solicitar imunidade ITBI
export async function solicitarImunidade(
  id: string,
  payload: SolicitarImunidadeRequest
): Promise<Tributario> {
  const { data } = await apiClient.post<Tributario>(`/tributario/${id}/imunidade`, payload);
  return data;
}

// Atualizar status da imunidade (deferir/indeferir)
export async function atualizarImunidade(
  id: string,
  status: 'DEFERIDA' | 'INDEFERIDA',
  payload: AtualizarImunidadeRequest
): Promise<Tributario> {
  const { data } = await apiClient.patch<Tributario>(`/tributario/${id}/imunidade/${status}`, payload);
  return data;
}

// Emitir guia tributária
export async function emitirGuia(tributarioId: string, guia: EmitirGuiaRequest): Promise<Tributario> {
  const { data } = await apiClient.post<Tributario>(`/tributario/${tributarioId}/guias`, guia);
  return data;
}

// Registrar pagamento de guia
export async function registrarPagamento(
  guiaId: string,
  pagamento: RegistrarPagamentoRequest
): Promise<Tributario> {
  const { data } = await apiClient.post<Tributario>(`/tributario/guias/${guiaId}/pagamento`, pagamento);
  return data;
}

// Verificar se pode avançar para etapa 7
export async function verificarPodeAvancar(projetoId: string): Promise<PodeAvancarResponse> {
  const { data } = await apiClient.get<PodeAvancarResponse>(`/tributario/projeto/${projetoId}/pode-avancar`);
  return data;
}

// Protocolar dossiê administrativo
export async function protocolarDossie(
  id: string,
  payload: ProtocolarDossieRequest
): Promise<Tributario> {
  const { data } = await apiClient.post<Tributario>(`/tributario/${id}/dossie`, payload);
  return data;
}

// Atualizar status do dossiê
export async function atualizarDossie(id: string, status: string): Promise<Tributario> {
  const { data } = await apiClient.patch<Tributario>(`/tributario/${id}/dossie`, { status });
  return data;
}
