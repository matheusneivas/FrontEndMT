import { z } from 'zod';
import { RoleType, TipoFluxo, ClienteStatus, StatusProjeto, StatusEtapa, TipoDocumento } from '../types';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.nativeEnum(RoleType),
});

// Cliente schemas
export const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido')
    .optional()
    .or(z.literal('')),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, 'CNPJ inválido')
    .optional()
    .or(z.literal('')),
  endereco: z.string().optional(),
  status: z.nativeEnum(ClienteStatus).default(ClienteStatus.ATIVO),
  observacoes: z.string().optional(),
  userId: z.string().optional(),
});

// Projeto schemas
export const projetoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  tipo_fluxo: z.nativeEnum(TipoFluxo),
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  advogadoId: z.string().optional(),
  dataInicio: z.string().optional(),
  dataPrevisao: z.string().optional(),
});

export const updateProjetoSchema = projetoSchema.partial().extend({
  status: z.nativeEnum(StatusProjeto).optional(),
  dataConclusao: z.string().optional(),
});

// Etapa schemas
export const etapaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  ordem: z.number().int().positive(),
  projetoId: z.string().min(1, 'Projeto é obrigatório'),
  prazo: z.string().optional(),
  responsavel: z.string().optional(),
  observacoes: z.string().optional(),
});

export const updateEtapaSchema = etapaSchema.partial().extend({
  status: z.nativeEnum(StatusEtapa).optional(),
  dataConclusao: z.string().optional(),
});

// Documento schemas
export const documentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tipo: z.nativeEnum(TipoDocumento),
  arquivo: z.string().min(1, 'Arquivo é obrigatório'),
  projetoId: z.string().min(1, 'Projeto é obrigatório'),
});

// User schemas
export const updateUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.nativeEnum(RoleType).optional(),
  ativo: z.boolean().optional(),
});

// Config schemas
export const configSchema = z.object({
  key: z.string().min(1, 'Chave é obrigatória'),
  value: z.string().min(1, 'Valor é obrigatório'),
  description: z.string().optional(),
});

// Helper type extractors
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClienteFormData = z.infer<typeof clienteSchema>;
export type ProjetoFormData = z.infer<typeof projetoSchema>;
export type UpdateProjetoFormData = z.infer<typeof updateProjetoSchema>;
export type EtapaFormData = z.infer<typeof etapaSchema>;
export type UpdateEtapaFormData = z.infer<typeof updateEtapaSchema>;
export type DocumentoFormData = z.infer<typeof documentoSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ConfigFormData = z.infer<typeof configSchema>;
