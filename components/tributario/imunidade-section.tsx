'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSolicitarImunidade, useAtualizarImunidade } from '@/lib/hooks/useTributario';
import { Tributario, StatusImunidade } from '@/lib/types/tributario';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { format } from 'date-fns';

const formSchema = z.object({
  protocolo: z.string().min(1, 'Informe o número do protocolo'),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ImunidadeSectionProps {
  tributario: Tributario;
}

export function ImunidadeSection({ tributario }: ImunidadeSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const mutationSolicitar = useSolicitarImunidade();
  const mutationAtualizar = useAtualizarImunidade();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleSolicitar = async (values: FormValues) => {
    await mutationSolicitar.mutateAsync({
      id: tributario.id,
      protocolo: values.protocolo,
      observacoes: values.observacoes,
    });
    setDialogOpen(false);
    form.reset();
  };

  const handleDeferir = async () => {
    await mutationAtualizar.mutateAsync({
      id: tributario.id,
      status: 'DEFERIDA',
      dataDecisao: format(new Date(), 'yyyy-MM-dd'),
      observacoes: 'Deferido',
    });
  };

  const handleIndeferir = async () => {
    await mutationAtualizar.mutateAsync({
      id: tributario.id,
      status: 'INDEFERIDA',
      dataDecisao: format(new Date(), 'yyyy-MM-dd'),
      observacoes: 'Indeferido',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imunidade ITBI</CardTitle>
        <CardDescription>
          Gerenciamento da solicitação de imunidade tributária para integralização de bens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!tributario.imunidadeStatus || tributario.imunidadeStatus === StatusImunidade.NAO_APLICAVEL ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Solicite a imunidade de ITBI para integralização de bens junto ao órgão competente
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              Solicitar Imunidade ITBI
            </Button>
          </div>
        ) : tributario.imunidadeStatus === StatusImunidade.EM_ANALISE ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Em Análise</AlertTitle>
              <AlertDescription>
                <div className="space-y-1 mt-2">
                  <div>
                    <span className="font-semibold">Protocolo:</span> {tributario.imunidadeProtocolo}
                  </div>
                  {tributario.imunidadeObservacoes && (
                    <div>
                      <span className="font-semibold">Observações:</span>{' '}
                      {tributario.imunidadeObservacoes}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button
                onClick={handleDeferir}
                disabled={mutationAtualizar.isPending}
                variant="default"
              >
                Deferir Imunidade
              </Button>
              <Button
                onClick={handleIndeferir}
                disabled={mutationAtualizar.isPending}
                variant="destructive"
              >
                Indeferir Imunidade
              </Button>
            </div>
          </div>
        ) : tributario.imunidadeStatus === StatusImunidade.DEFERIDA ? (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Imunidade Deferida</AlertTitle>
            <AlertDescription className="text-green-700">
              <div className="space-y-1 mt-2">
                <div>
                  <span className="font-semibold">Protocolo:</span> {tributario.imunidadeProtocolo}
                </div>
                {tributario.imunidadeDeferimento && (
                  <div>
                    <span className="font-semibold">Data de Deferimento:</span>{' '}
                    {formatDate(tributario.imunidadeDeferimento)}
                  </div>
                )}
                {tributario.imunidadeObservacoes && (
                  <div>
                    <span className="font-semibold">Observações:</span>{' '}
                    {tributario.imunidadeObservacoes}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Imunidade Indeferida</AlertTitle>
            <AlertDescription>
              <div className="space-y-1 mt-2">
                <div>
                  <span className="font-semibold">Protocolo:</span> {tributario.imunidadeProtocolo}
                </div>
                {tributario.imunidadeObservacoes && (
                  <div>
                    <span className="font-semibold">Motivo:</span> {tributario.imunidadeObservacoes}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Imunidade ITBI</DialogTitle>
              <DialogDescription>
                Informe o protocolo da solicitação de imunidade tributária
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSolicitar)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="protocolo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Protocolo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 2024/001234" {...field} />
                      </FormControl>
                      <FormDescription>
                        Protocolo da solicitação junto ao órgão competente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre a solicitação"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutationSolicitar.isPending} className="w-full">
                  {mutationSolicitar.isPending ? 'Solicitando...' : 'Solicitar Imunidade'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
