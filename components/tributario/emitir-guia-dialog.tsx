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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmitirGuia } from '@/lib/hooks/useTributario';
import { TipoGuia, tipoGuiaLabels } from '@/lib/types/tributario';
import { Plus } from 'lucide-react';
import { addDays, format } from 'date-fns';

const formSchema = z.object({
  tipo: z.nativeEnum(TipoGuia, {
    required_error: 'Selecione o tipo de guia',
  }),
  numero: z.string().optional(),
  valor: z.string().min(1, 'Informe o valor da guia'),
  dataEmissao: z.string().min(1, 'Informe a data de emissão'),
  dataVencimento: z.string().min(1, 'Informe a data de vencimento'),
});

type FormValues = z.infer<typeof formSchema>;

interface EmitirGuiaDialogProps {
  tributarioId: string;
}

export function EmitirGuiaDialog({ tributarioId }: EmitirGuiaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEmitirGuia();

  const today = format(new Date(), 'yyyy-MM-dd');
  const futureDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataEmissao: today,
      dataVencimento: futureDate,
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Converter valor de string para centavos (número)
    const valorEmReais = parseFloat(values.valor);
    const valorEmCentavos = Math.round(valorEmReais * 100);

    await mutation.mutateAsync({
      tributarioId,
      guia: {
        tipo: values.tipo,
        numero: values.numero,
        valor: valorEmCentavos,
        dataEmissao: values.dataEmissao,
        dataVencimento: values.dataVencimento,
      },
    });

    setOpen(false);
    form.reset({
      dataEmissao: today,
      dataVencimento: futureDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Emitir Guia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Emitir Nova Guia Tributária</DialogTitle>
          <DialogDescription>
            Preencha os dados da guia tributária a ser emitida
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Guia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TipoGuia).map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipoGuiaLabels[tipo]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Guia (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2024/001234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Ex: 1500.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Informe o valor em reais (ex: 1500.00)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataVencimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? 'Emitindo...' : 'Emitir Guia'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
