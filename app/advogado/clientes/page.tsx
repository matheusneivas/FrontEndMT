'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { clientesApi } from '@/lib/api';
import { clienteStatusLabels, clienteStatusColors, formatCPF, formatCNPJ, formatPhone } from '@/lib/utils/formatters';
import { UserCircle, Plus, Search, Mail, Phone, FileText, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage] = useState(1);

  const { data: clientesData, isLoading } = useQuery({
    queryKey: ['clientes', currentPage, searchTerm],
    queryFn: () => clientesApi.getAll(currentPage, 50, searchTerm ? { search: searchTerm } : undefined),
  });

  const clientes = clientesData?.data || [];

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
            <UserCircle className="h-8 w-8" />
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e suas informações
          </p>
        </div>
        <Button asChild>
          <Link href="/advogado/clientes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email, CPF ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {clientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? 'Tente ajustar os termos de busca'
                : 'Comece criando seu primeiro cliente'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/advogado/clientes/novo">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Cliente
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {clientes.length} cliente(s) encontrado(s)
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clientes.map((cliente) => {
              const statusColor = clienteStatusColors[cliente.status];
              return (
                <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-1 text-lg">{cliente.nome}</CardTitle>
                          <CardDescription className="line-clamp-1">{cliente.email}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusColor.bg} ${statusColor.text} ${statusColor.border} shrink-0`}
                      >
                        {clienteStatusLabels[cliente.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cliente.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{formatPhone(cliente.telefone)}</span>
                      </div>
                    )}

                    {cliente.cpf && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">CPF: {formatCPF(cliente.cpf)}</span>
                      </div>
                    )}

                    {cliente.cnpj && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">CNPJ: {formatCNPJ(cliente.cnpj)}</span>
                      </div>
                    )}

                    {cliente.endereco && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cliente.endereco}
                      </p>
                    )}

                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href={`/advogado/clientes/${cliente.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
