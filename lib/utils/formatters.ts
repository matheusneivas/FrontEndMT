import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  StatusProjeto,
  StatusEtapa,
  TipoFluxo,
  ClienteStatus,
  RoleType,
  TipoDocumento,
} from '../types';

// Date formatters
export const formatDate = (date: string | Date, formatStr = 'dd/MM/yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ptBR });
  } catch {
    return '-';
  }
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
  } catch {
    return '-';
  }
};

// Status labels
export const projetoStatusLabels: Record<StatusProjeto, string> = {
  [StatusProjeto.PENDENTE]: 'Pendente',
  [StatusProjeto.EM_ANDAMENTO]: 'Em Andamento',
  [StatusProjeto.AGUARDANDO_CLIENTE]: 'Aguardando Cliente',
  [StatusProjeto.CONCLUIDO]: 'Concluído',
  [StatusProjeto.CANCELADO]: 'Cancelado',
};

export const etapaStatusLabels: Record<StatusEtapa, string> = {
  [StatusEtapa.PENDENTE]: 'Pendente',
  [StatusEtapa.EM_ANDAMENTO]: 'Em Andamento',
  [StatusEtapa.CONCLUIDA]: 'Concluída',
  [StatusEtapa.BLOQUEADA]: 'Bloqueada',
};

export const tipoFluxoLabels: Record<TipoFluxo, string> = {
  [TipoFluxo.PPS]: 'PPS',
  [TipoFluxo.REESTRUTURACAO]: 'Reestruturação',
  [TipoFluxo.CONTRATOS]: 'Contratos',
  [TipoFluxo.MA]: 'M&A',
};

export const clienteStatusLabels: Record<ClienteStatus, string> = {
  [ClienteStatus.ATIVO]: 'Ativo',
  [ClienteStatus.INATIVO]: 'Inativo',
  [ClienteStatus.BLOQUEADO]: 'Bloqueado',
};

export const roleTypeLabels: Record<RoleType, string> = {
  [RoleType.ADMIN]: 'Administrador',
  [RoleType.ADVOGADO]: 'Advogado',
  [RoleType.CLIENTE]: 'Cliente',
};

export const tipoDocumentoLabels: Record<TipoDocumento, string> = {
  [TipoDocumento.CONTRATO]: 'Contrato',
  [TipoDocumento.PROCURACAO]: 'Procuração',
  [TipoDocumento.PETICAO]: 'Petição',
  [TipoDocumento.SENTENCA]: 'Sentença',
  [TipoDocumento.COMPROVANTE]: 'Comprovante',
  [TipoDocumento.OUTRO]: 'Outro',
};

// Status colors for badges
export const projetoStatusColors: Record<
  StatusProjeto,
  { bg: string; text: string; border: string }
> = {
  [StatusProjeto.PENDENTE]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  [StatusProjeto.EM_ANDAMENTO]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  [StatusProjeto.AGUARDANDO_CLIENTE]: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  [StatusProjeto.CONCLUIDO]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  [StatusProjeto.CANCELADO]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

export const etapaStatusColors: Record<
  StatusEtapa,
  { bg: string; text: string; border: string }
> = {
  [StatusEtapa.PENDENTE]: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
  [StatusEtapa.EM_ANDAMENTO]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  [StatusEtapa.CONCLUIDA]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  [StatusEtapa.BLOQUEADA]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

export const clienteStatusColors: Record<
  ClienteStatus,
  { bg: string; text: string; border: string }
> = {
  [ClienteStatus.ATIVO]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  [ClienteStatus.INATIVO]: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
  [ClienteStatus.BLOQUEADO]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

// Document & CPF/CNPJ formatters
export const formatCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCNPJ = (cnpj: string) => {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

// Currency formatter
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Currency formatter for values in cents
export const formatCurrencyFromCents = (centavos: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
};

// Initials from name
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
