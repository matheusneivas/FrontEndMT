'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { RoleType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { PageLoading } from '@/components/common/loading';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, perfil, isLoading } = useAuth();

  if (isLoading) return <PageLoading />;

  // Métricas de exemplo - conectar com API real
  const adminMetrics = {
    totalUsers: 45,
    totalClientes: 32,
    projetosAtivos: 28,
    projetosConcluidos: 15,
  };

  const advogadoMetrics = {
    projetosAtivos: 12,
    projetosConcluidos: 8,
    projetosPendentes: 3,
    clientesAtivos: 15,
  };

  const clienteMetrics = {
    projetosAtivos: 2,
    projetosConcluidos: 1,
    documentosPendentes: 3,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo, {user?.nome}!</p>
      </div>

      {/* Admin Dashboard */}
      {perfil === RoleType.ADMIN && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminMetrics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+2 este mês</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/advogado/clientes">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminMetrics.totalClientes}</div>
                <p className="text-xs text-muted-foreground">+3 este mês</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/advogado/projetos">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminMetrics.projetosAtivos}</div>
                <p className="text-xs text-muted-foreground">62% do total</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/advogado/projetos">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminMetrics.projetosConcluidos}</div>
                <p className="text-xs text-muted-foreground">+5 este mês</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Advogado Dashboard */}
      {perfil === RoleType.ADVOGADO && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advogadoMetrics.projetosAtivos}</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advogadoMetrics.projetosConcluidos}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advogadoMetrics.projetosPendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando início</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advogadoMetrics.clientesAtivos}</div>
              <p className="text-xs text-muted-foreground">Total de clientes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cliente Dashboard */}
      {perfil === RoleType.CLIENTE && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clienteMetrics.projetosAtivos}</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clienteMetrics.projetosConcluidos}</div>
              <p className="text-xs text-muted-foreground">Finalizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clienteMetrics.documentosPendentes}</div>
              <p className="text-xs text-muted-foreground">Para revisar</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Novo projeto criado: Processo Trabalhista #{i}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Há {i} hora{i > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
