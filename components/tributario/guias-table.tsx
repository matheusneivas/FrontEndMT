'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { GuiaTributaria, tipoGuiaLabels, StatusGuia } from '@/lib/types/tributario';
import { formatCurrencyFromCents, formatDate } from '@/lib/utils/formatters';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { RegistrarPagamentoDialog } from './registrar-pagamento-dialog';

interface GuiasTableProps {
  guias: GuiaTributaria[];
}

export function GuiasTable({ guias }: GuiasTableProps) {
  if (!guias || guias.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma guia emitida
      </div>
    );
  }

  const getStatusIcon = (status: StatusGuia) => {
    switch (status) {
      case StatusGuia.PAGA:
        return <CheckCircle className="h-4 w-4" />;
      case StatusGuia.VENCIDA:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: StatusGuia) => {
    switch (status) {
      case StatusGuia.PAGA:
        return 'default';
      case StatusGuia.VENCIDA:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guias.map((guia) => (
            <TableRow key={guia.id}>
              <TableCell>
                <Badge variant="outline">{tipoGuiaLabels[guia.tipo]}</Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {guia.numero || '-'}
              </TableCell>
              <TableCell className="font-semibold">
                {formatCurrencyFromCents(guia.valor)}
              </TableCell>
              <TableCell>{formatDate(guia.dataEmissao)}</TableCell>
              <TableCell>{formatDate(guia.dataVencimento)}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusVariant(guia.status)}
                  className="flex items-center gap-1 w-fit"
                >
                  {getStatusIcon(guia.status)}
                  {guia.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {guia.status !== StatusGuia.PAGA && (
                  <RegistrarPagamentoDialog guia={guia} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
