'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { clientesApi, projetosApi } from '@/lib/api';
import { TipoFluxo } from '@/lib/types';
import { tipoFluxoLabels } from '@/lib/utils/formatters';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const formSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  tipo_fluxo: z.nativeEnum(TipoFluxo, {
    required_error: 'Selecione o tipo de fluxo',
  }),
  clienteId: z.string().min(1, 'Selecione um cliente'),
  dataInicio: z.string().optional(),
  dataPrevisao: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NovoProjetoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: clientesData, isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes', 'all'],
    queryFn: () => clientesApi.getAll(1, 100),
  });

  const clientes = Array.isArray(clientesData?.data) ? clientesData.data : [];

  const mutation = useMutation({
    mutationFn: (data: FormValues) => projetosApi.create(data),
    onSuccess: (projeto) => {
      toast.success('Projeto criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['projetos'] });
      router.push(`/advogado/projetos/${projeto.id}`);
    },
    onError: () => {
      toast.error('Erro ao criar projeto');
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataInicio: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/advogado/projetos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Novo Projeto</h1>
            <p className="text-muted-foreground">Crie um novo projeto para seu cliente</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
          <CardDescription>Preencha os dados do novo projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Estruturação societária Empresa X" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome identificador do projeto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os objetivos e escopo do projeto..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_fluxo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Fluxo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de fluxo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TipoFluxo).map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipoFluxoLabels[tipo]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define as etapas e processos do projeto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingClientes}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingClientes ? 'Carregando clientes...' : 'Selecione o cliente'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Cliente responsável pelo projeto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataPrevisao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previsão de Conclusão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={mutation.isPending} className="flex-1">
                  {mutation.isPending ? 'Criando...' : 'Criar Projeto'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
