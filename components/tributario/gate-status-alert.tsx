'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import type { PodeAvancarResponse } from '@/lib/types/tributario';

interface GateStatusAlertProps {
  podeAvancar?: PodeAvancarResponse;
}

export function GateStatusAlert({ podeAvancar }: GateStatusAlertProps) {
  if (!podeAvancar) {
    return null;
  }

  if (podeAvancar.podeAvancar) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 font-semibold">
          Pronto para Avançar
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Todas as pendências tributárias foram resolvidas. O projeto pode avançar para a etapa
          de Registros (Etapa 7).
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <XCircle className="h-5 w-5" />
      <AlertTitle className="font-semibold">Bloqueado - Pendências Tributárias</AlertTitle>
      <AlertDescription>
        {podeAvancar.motivo ||
          'Existem pendências tributárias que impedem o avanço para a próxima etapa. Resolva as pendências para continuar.'}
      </AlertDescription>
    </Alert>
  );
}
