'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProtocolarDossie, useUpdateTributario } from '@/lib/hooks/useTributario';
import { Tributario } from '@/lib/types/tributario';
import { formatDate } from '@/lib/utils/formatters';
import { FileText } from 'lucide-react';

const formSchema = z.object({
  protocolo: z.string().min(1, 'Informe o número do protocolo'),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DossieSectionProps {
  tributario: Tributario;
}

export function DossieSection({ tributario }: DossieSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const mutationProtocolar = useProtocolarDossie();
  const mutationAtualizar = useUpdateTributario();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleProtocolar = async (values: FormValues) => {
    await mutationProtocolar.mutateAsync({
      id: tributario.id,
      protocolo: values.protocolo,
      observacoes: values.observacoes,
    });
    setDialogOpen(false);
    form.reset();
  };

  const handleAtualizarStatus = async (status: string) => {
    await mutationAtualizar.mutateAsync({
      id: tributario.id,
      data: { dossieStatus: status },
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'DEFERIDO':
        return 'default';
      case 'INDEFERIDO':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Dossiê Administrativo
        </CardTitle>
        <CardDescription>
          Protocolo e acompanhamento do dossiê junto aos órgãos competentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!tributario.dossieProtocolo ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Protocole o dossiê administrativo com a documentação tributária
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              Protocolar Dossiê
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Protocolo:</span>
                <span className="font-mono font-semibold">{tributario.dossieProtocolo}</span>
              </div>

              {tributario.dossieStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <Badge variant={getStatusVariant(tributario.dossieStatus)}>
                    {tributario.dossieStatus}
                  </Badge>
                </div>
              )}

              {tributario.dossieData && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Data de Protocolo:
                  </span>
                  <span>{formatDate(tributario.dossieData)}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Atualizar Status</label>
              <Select
                value={tributario.dossieStatus || ''}
                onValueChange={handleAtualizarStatus}
                disabled={mutationAtualizar.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
                  <SelectItem value="DEFERIDO">Deferido</SelectItem>
                  <SelectItem value="INDEFERIDO">Indeferido</SelectItem>
                  <SelectItem value="EXIGENCIA">Exigência</SelectItem>
                  <SelectItem value="RECURSO">Recurso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Protocolar Dossiê Administrativo</DialogTitle>
              <DialogDescription>
                Informe o protocolo do dossiê junto ao órgão competente
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleProtocolar)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="protocolo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Protocolo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 2024/DOSSIE/001234" {...field} />
                      </FormControl>
                      <FormDescription>
                        Protocolo do dossiê administrativo
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
                          placeholder="Informações adicionais sobre o protocolo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutationProtocolar.isPending} className="w-full">
                  {mutationProtocolar.isPending ? 'Protocolando...' : 'Protocolar Dossiê'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
