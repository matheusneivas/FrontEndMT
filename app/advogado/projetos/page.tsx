'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { projetosApi } from '@/lib/api';
import {
  tipoFluxoLabels,
  projetoStatusLabels,
  projetoStatusColors,
  formatDate,
} from '@/lib/utils/formatters';
import { Briefcase, Plus, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ProjetosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projetosData, isLoading, error } = useQuery({
    queryKey: ['projetos', 'list'],
    queryFn: () => projetosApi.getAll(1, 100),
  });

  const projetos = projetosData?.data || [];

  const filteredProjetos = projetos?.filter((projeto) =>
    projeto.estrategiaDefinida?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.tipoFluxo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Menu Principal
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Meus Projetos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus projetos e processos
          </p>
        </div>
        <Button asChild>
          <Link href="/advogado/projetos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {!filteredProjetos || filteredProjetos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? 'Tente ajustar os termos de busca'
                : 'Comece criando seu primeiro projeto'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/advogado/projetos/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Projeto
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {filteredProjetos.length} projeto(s) encontrado(s)
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjetos.map((projeto) => {
              const statusColor = projetoStatusColors[projeto.status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
              return (
                <Link key={projeto.id} href={`/advogado/projetos/${projeto.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2">
                          {projeto.estrategiaDefinida || `Projeto ${tipoFluxoLabels[projeto.tipoFluxo]}`}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`${statusColor.bg} ${statusColor.text} ${statusColor.border} shrink-0`}
                        >
                          {projetoStatusLabels[projeto.status] || projeto.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {projeto.observacoes || 'Sem observações'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tipo:</span>
                          <Badge variant="secondary">
                            {tipoFluxoLabels[projeto.tipoFluxo]}
                          </Badge>
                        </div>

                        {projeto.cliente && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Cliente:</span>
                            <span className="font-medium truncate ml-2">
                              {projeto.cliente.nome}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Criado em:</span>
                          <span>{formatDate(projeto.createdAt)}</span>
                        </div>

                        {projeto.etapas && projeto.etapas.length > 0 && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-muted-foreground mb-1">
                              Progresso das etapas
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{
                                  width: `${(projeto.etapas.filter((e) => e.status === 'CONCLUIDA').length /
                                    projeto.etapas.length) *
                                    100}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {projeto.etapas.filter((e) => e.status === 'CONCLUIDA').length} de{' '}
                              {projeto.etapas.length} etapas concluídas
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
