'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTributario, useVerificarPodeAvancar } from '@/lib/hooks/useTributario';
import {
  TipoOperacaoTributaria,
  statusTributarioLabels,
} from '@/lib/types/tributario';
import { AnaliseTributariaForm } from '@/components/tributario/analise-tributaria-form';
import { TributarioOverview } from '@/components/tributario/tributario-overview';
import { GuiasTable } from '@/components/tributario/guias-table';
import { EmitirGuiaDialog } from '@/components/tributario/emitir-guia-dialog';
import { ImunidadeSection } from '@/components/tributario/imunidade-section';
import { DossieSection } from '@/components/tributario/dossie-section';
import { GateStatusAlert } from '@/components/tributario/gate-status-alert';
import { ArrowLeft } from 'lucide-react';

interface TributarioPageProps {
  params: Promise<{ id: string }>;
}

export default function TributarioPage({ params }: TributarioPageProps) {
  const { id: projetoId } = use(params);
  const { data: tributario, isLoading } = useTributario(projetoId);
  const { data: podeAvancar } = useVerificarPodeAvancar(projetoId);

  const getStatusVariant = (status: string) => {
    if (status === 'CONCLUIDA' || status === 'PAGO' || status === 'IMUNIDADE_DEFERIDA') {
      return 'default';
    }
    if (status === 'PENDENTE' || status === 'AGUARDANDO_PAGAMENTO') {
      return 'secondary';
    }
    return 'outline';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!tributario) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise Tributária</CardTitle>
            <CardDescription>
              Configure a análise tributária deste projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnaliseTributariaForm projetoId={projetoId} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" asChild className="mb-2">
        <Link href="/advogado/projetos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Projetos
        </Link>
      </Button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Análise Tributária</h1>
        <Badge variant={getStatusVariant(tributario.status)}>
          {statusTributarioLabels[tributario.status]}
        </Badge>
      </div>

      <GateStatusAlert podeAvancar={podeAvancar} />

      <TributarioOverview tributario={tributario} />

      <Tabs defaultValue="guias" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guias">Guias</TabsTrigger>
          {tributario.tipo === TipoOperacaoTributaria.INTEGRALIZACAO && (
            <TabsTrigger value="imunidade">Imunidade</TabsTrigger>
          )}
          <TabsTrigger value="dossie">Dossiê</TabsTrigger>
        </TabsList>

        <TabsContent value="guias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Guias Tributárias</CardTitle>
                  <CardDescription>
                    Gerencie as guias de pagamento de tributos
                  </CardDescription>
                </div>
                <EmitirGuiaDialog tributarioId={tributario.id} />
              </div>
            </CardHeader>
            <CardContent>
              <GuiasTable guias={tributario.guias || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {tributario.tipo === TipoOperacaoTributaria.INTEGRALIZACAO && (
          <TabsContent value="imunidade">
            <ImunidadeSection tributario={tributario} />
          </TabsContent>
        )}

        <TabsContent value="dossie">
          <DossieSection tributario={tributario} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
