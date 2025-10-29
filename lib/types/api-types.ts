import {
  RoleType,
  StatusProjeto,
  StatusEtapa,
  TipoFluxo,
  ClienteStatus,
  TipoDocumento,
  AtividadeStatus,
} from './enums';

// User types
export interface User {
  id: string;
  email: string;
  nome: string;
  role: RoleType;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
  role: RoleType;
}

// Cliente types
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  endereco?: string;
  status: ClienteStatus;
  observacoes?: string;
  userId?: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteRequest {
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  endereco?: string;
  status?: ClienteStatus;
  observacoes?: string;
  userId?: string;
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

// Projeto types
export interface Projeto {
  id: string;
  titulo: string;
  descricao?: string;
  tipo_fluxo: TipoFluxo;
  status: StatusProjeto;
  clienteId: string;
  cliente?: Cliente;
  advogadoId: string;
  advogado?: User;
  etapas?: Etapa[];
  documentos?: Documento[];
  atividades?: Atividade[];
  dataInicio?: string;
  dataPrevisao?: string;
  dataConclusao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjetoRequest {
  titulo: string;
  descricao?: string;
  tipo_fluxo: TipoFluxo;
  clienteId: string;
  advogadoId?: string;
  dataInicio?: string;
  dataPrevisao?: string;
}

export interface UpdateProjetoRequest extends Partial<CreateProjetoRequest> {
  status?: StatusProjeto;
  dataConclusao?: string;
}

// Etapa types
export interface Etapa {
  id: string;
  nome: string;
  descricao?: string;
  ordem: number;
  status: StatusEtapa;
  projetoId: string;
  projeto?: Projeto;
  prazo?: string;
  dataConclusao?: string;
  responsavel?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEtapaRequest {
  nome: string;
  descricao?: string;
  ordem: number;
  projetoId: string;
  prazo?: string;
  responsavel?: string;
  observacoes?: string;
}

export interface UpdateEtapaRequest extends Partial<CreateEtapaRequest> {
  status?: StatusEtapa;
  dataConclusao?: string;
}

// Documento types
export interface Documento {
  id: string;
  nome: string;
  tipo: TipoDocumento;
  arquivo: string;
  projetoId: string;
  projeto?: Projeto;
  uploadedBy?: string;
  uploader?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentoRequest {
  nome: string;
  tipo: TipoDocumento;
  arquivo: string;
  projetoId: string;
}

// Atividade types
export interface Atividade {
  id: string;
  descricao: string;
  status: AtividadeStatus;
  projetoId: string;
  projeto?: Projeto;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAtividadeRequest {
  descricao: string;
  status: AtividadeStatus;
  projetoId: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Dashboard types
export interface DashboardMetrics {
  totalProjetos: number;
  projetosAtivos: number;
  projetosConcluidos: number;
  totalClientes: number;
  clientesAtivos: number;
  etapasPendentes: number;
  etapasVencidas: number;
  atividadesRecentes: Atividade[];
}

// Filter types
export interface ProjetoFilters {
  status?: StatusProjeto;
  tipo_fluxo?: TipoFluxo;
  clienteId?: string;
  advogadoId?: string;
  search?: string;
}

export interface ClienteFilters {
  status?: ClienteStatus;
  search?: string;
}

export interface UserFilters {
  role?: RoleType;
  ativo?: boolean;
  search?: string;
}
