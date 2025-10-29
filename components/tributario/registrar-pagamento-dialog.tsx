'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegistrarPagamento } from '@/lib/hooks/useTributario';
import { GuiaTributaria, tipoGuiaLabels } from '@/lib/types/tributario';
import { formatCurrencyFromCents } from '@/lib/utils/formatters';
import { format } from 'date-fns';

const formSchema = z.object({
  dataPagamento: z.string().min(1, 'Informe a data do pagamento'),
  comprovanteDriveId: z.string().min(1, 'Informe o ID do comprovante'),
});

type FormValues = z.infer<typeof formSchema>;

interface RegistrarPagamentoDialogProps {
  guia: GuiaTributaria;
}

export function RegistrarPagamentoDialog({ guia }: RegistrarPagamentoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useRegistrarPagamento();

  const today = format(new Date(), 'yyyy-MM-dd');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataPagamento: today,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync({
      guiaId: guia.id,
      pagamento: {
        dataPagamento: values.dataPagamento,
        comprovanteDriveId: values.comprovanteDriveId,
      },
    });

    setOpen(false);
    form.reset({ dataPagamento: today });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Registrar Pagamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
          <DialogDescription>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-sm">Tipo:</span>
                <span className="font-semibold">{tipoGuiaLabels[guia.tipo]}</span>
              </div>
              {guia.numero && (
                <div className="flex justify-between">
                  <span className="text-sm">Número:</span>
                  <span className="font-mono text-sm">{guia.numero}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm">Valor:</span>
                <span className="font-semibold text-lg">
                  {formatCurrencyFromCents(guia.valor)}
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dataPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Pagamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comprovanteDriveId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprovante</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ID do arquivo no Google Drive"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Por enquanto, insira o ID do comprovante no Drive manualmente.
                    Upload de arquivos será implementado posteriormente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? 'Registrando...' : 'Confirmar Pagamento'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
