'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateTributario } from '@/lib/hooks/useTributario';
import { TipoOperacaoTributaria, tipoOperacaoLabels } from '@/lib/types/tributario';

const formSchema = z.object({
  tipo: z.nativeEnum(TipoOperacaoTributaria, {
    required_error: 'Selecione o tipo de operação',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AnaliseTributariaFormProps {
  projetoId: string;
}

export function AnaliseTributariaForm({ projetoId }: AnaliseTributariaFormProps) {
  const router = useRouter();
  const mutation = useCreateTributario();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync({
      projetoId,
      tipo: values.tipo,
    });
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Operação Tributária</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de operação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TipoOperacaoTributaria).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipoOperacaoLabels[tipo]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione o tipo de operação para configurar a análise tributária adequada
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? 'Criando...' : 'Criar Análise Tributária'}
        </Button>
      </form>
    </Form>
  );
}
