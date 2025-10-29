'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tributario,
  tipoOperacaoLabels,
  statusTributarioLabels,
} from '@/lib/types/tributario';
import { formatCurrencyFromCents } from '@/lib/utils/formatters';
import { CheckCircle, XCircle } from 'lucide-react';

interface TributarioOverviewProps {
  tributario: Tributario;
}

export function TributarioOverview({ tributario }: TributarioOverviewProps) {
  const getStatusVariant = (status: string) => {
    if (status === 'CONCLUIDA' || status === 'PAGO' || status === 'IMUNIDADE_DEFERIDA') {
      return 'default';
    }
    if (status === 'PENDENTE' || status === 'AGUARDANDO_PAGAMENTO') {
      return 'secondary';
    }
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Análise Tributária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Tipo de Operação:</span>
            <Badge variant="outline">{tipoOperacaoLabels[tributario.tipo]}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Badge variant={getStatusVariant(tributario.status)}>
              {statusTributarioLabels[tributario.status]}
            </Badge>
          </div>

          {tributario.guiasEmitidas && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Valor Total das Guias:</span>
              <span className="text-lg font-bold">
                {formatCurrencyFromCents(tributario.guiasValorTotal || 0)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Comprovantes Recebidos:</span>
            <Badge variant={tributario.comprovantesRecebidos ? 'default' : 'secondary'} className="flex items-center gap-1">
              {tributario.comprovantesRecebidos ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Sim
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Não
                </>
              )}
            </Badge>
          </div>

          {tributario.dossieProtocolo && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Dossiê Protocolado:</span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                {tributario.dossieProtocolo}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
