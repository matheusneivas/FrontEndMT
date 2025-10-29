// Enums para módulo tributário
export enum TipoOperacaoTributaria {
  INTEGRALIZACAO = 'INTEGRALIZACAO',
  DOACAO = 'DOACAO',
  OUTROS = 'OUTROS',
}

export enum StatusTributario {
  PENDENTE = 'PENDENTE',
  EM_CALCULO = 'EM_CALCULO',
  EM_DOSSIE = 'EM_DOSSIE',
  GUIAS_EMITIDAS = 'GUIAS_EMITIDAS',
  AGUARDANDO_PAGAMENTO = 'AGUARDANDO_PAGAMENTO',
  PAGO = 'PAGO',
  IMUNIDADE_DEFERIDA = 'IMUNIDADE_DEFERIDA',
  EXIGENCIA = 'EXIGENCIA',
  CONCLUIDA = 'CONCLUIDA',
}

export enum StatusImunidade {
  NAO_APLICAVEL = 'NAO_APLICAVEL',
  EM_ANALISE = 'EM_ANALISE',
  DEFERIDA = 'DEFERIDA',
  INDEFERIDA = 'INDEFERIDA',
  RECURSO = 'RECURSO',
}

export enum TipoGuia {
  ITBI = 'ITBI',
  ITCMD = 'ITCMD',
  IPTU = 'IPTU',
  TAXA_JUNTA = 'TAXA_JUNTA',
  TAXA_CARTORIO = 'TAXA_CARTORIO',
  OUTROS = 'OUTROS',
}

export enum StatusGuia {
  PENDENTE = 'PENDENTE',
  ENVIADA = 'ENVIADA',
  PAGA = 'PAGA',
  VENCIDA = 'VENCIDA',
  CANCELADA = 'CANCELADA',
}

// Interfaces
export interface GuiaTributaria {
  id: string;
  tributarioId: string;
  tipo: TipoGuia;
  numero?: string;
  valor: number; // em centavos
  dataEmissao: Date | string;
  dataVencimento: Date | string;
  status: StatusGuia;
  dataPagamento?: Date | string;
  comprovanteDriveId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Tributario {
  id: string;
  projetoId: string;
  tipo: TipoOperacaoTributaria;
  status: StatusTributario;
  imunidadeStatus?: StatusImunidade;
  imunidadeProtocolo?: string;
  imunidadeDeferimento?: Date | string;
  imunidadeObservacoes?: string;
  guiasEmitidas: boolean;
  guiasValorTotal?: number; // em centavos
  comprovantesRecebidos: boolean;
  dossieProtocolo?: string;
  dossieStatus?: string;
  dossieData?: Date | string;
  guias?: GuiaTributaria[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Labels para exibição
export const tipoOperacaoLabels: Record<TipoOperacaoTributaria, string> = {
  [TipoOperacaoTributaria.INTEGRALIZACAO]: 'Integralização de Bens',
  [TipoOperacaoTributaria.DOACAO]: 'Doação',
  [TipoOperacaoTributaria.OUTROS]: 'Outros',
};

export const statusTributarioLabels: Record<StatusTributario, string> = {
  [StatusTributario.PENDENTE]: 'Pendente',
  [StatusTributario.EM_CALCULO]: 'Em Cálculo',
  [StatusTributario.EM_DOSSIE]: 'Em Dossiê',
  [StatusTributario.GUIAS_EMITIDAS]: 'Guias Emitidas',
  [StatusTributario.AGUARDANDO_PAGAMENTO]: 'Aguardando Pagamento',
  [StatusTributario.PAGO]: 'Pago',
  [StatusTributario.IMUNIDADE_DEFERIDA]: 'Imunidade Deferida',
  [StatusTributario.EXIGENCIA]: 'Exigência',
  [StatusTributario.CONCLUIDA]: 'Concluída',
};

export const statusImunidadeLabels: Record<StatusImunidade, string> = {
  [StatusImunidade.NAO_APLICAVEL]: 'Não Aplicável',
  [StatusImunidade.EM_ANALISE]: 'Em Análise',
  [StatusImunidade.DEFERIDA]: 'Deferida',
  [StatusImunidade.INDEFERIDA]: 'Indeferida',
  [StatusImunidade.RECURSO]: 'Recurso',
};

export const tipoGuiaLabels: Record<TipoGuia, string> = {
  [TipoGuia.ITBI]: 'ITBI',
  [TipoGuia.ITCMD]: 'ITCMD',
  [TipoGuia.IPTU]: 'IPTU',
  [TipoGuia.TAXA_JUNTA]: 'Taxa Junta Comercial',
  [TipoGuia.TAXA_CARTORIO]: 'Taxa Cartório',
  [TipoGuia.OUTROS]: 'Outros',
};

export const statusGuiaLabels: Record<StatusGuia, string> = {
  [StatusGuia.PENDENTE]: 'Pendente',
  [StatusGuia.ENVIADA]: 'Enviada',
  [StatusGuia.PAGA]: 'Paga',
  [StatusGuia.VENCIDA]: 'Vencida',
  [StatusGuia.CANCELADA]: 'Cancelada',
};

// Types para requests
export interface CreateTributarioRequest {
  projetoId: string;
  tipo: TipoOperacaoTributaria;
}

export interface UpdateTributarioRequest {
  tipo?: TipoOperacaoTributaria;
  status?: StatusTributario;
  dossieStatus?: string;
}

export interface SolicitarImunidadeRequest {
  protocolo: string;
  observacoes?: string;
}

export interface AtualizarImunidadeRequest {
  dataDecisao: string;
  observacoes?: string;
}

export interface EmitirGuiaRequest {
  tipo: TipoGuia;
  numero?: string;
  valor: number; // em centavos
  dataEmissao: string;
  dataVencimento: string;
}

export interface RegistrarPagamentoRequest {
  dataPagamento: string;
  comprovanteDriveId: string;
}

export interface ProtocolarDossieRequest {
  protocolo: string;
  observacoes?: string;
}

export interface PodeAvancarResponse {
  podeAvancar: boolean;
  motivo?: string;
}
