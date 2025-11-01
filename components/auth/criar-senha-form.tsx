'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const formSchema = z.object({
  senha: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(senhaRegex, 'Senha deve conter letra maiúscula, minúscula e número'),
  confirmarSenha: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type FormValues = z.infer<typeof formSchema>;

interface SenhaValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

interface CriarSenhaFormProps {
  token: string;
  clienteNome: string;
  clienteEmail: string;
  onSuccess: () => void;
}

export function CriarSenhaForm({ token, clienteNome, clienteEmail, onSuccess }: CriarSenhaFormProps) {
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [senhaValidation, setSenhaValidation] = useState<SenhaValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senha: '',
      confirmarSenha: '',
    },
  });

  const watchSenha = form.watch('senha');

  // Atualizar validações visuais quando senha mudar
  useEffect(() => {
    const senha = watchSenha || '';
    setSenhaValidation({
      minLength: senha.length >= 8,
      hasUpperCase: /[A-Z]/.test(senha),
      hasLowerCase: /[a-z]/.test(senha),
      hasNumber: /\d/.test(senha),
    });
  }, [watchSenha]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const response = await authApi.criarSenhaComToken({
        token,
        senha: values.senha,
        confirmarSenha: values.confirmarSenha,
      });

      if (response.success) {
        toast.success(response.message || 'Senha criada com sucesso!');
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao criar senha. Tente novamente.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ValidationItem = ({ isValid, label }: { isValid: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={isValid ? 'text-green-600' : 'text-red-500'}>{label}</span>
    </div>
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bem-vindo, {clienteNome}!</CardTitle>
        <CardDescription>
          Crie sua senha para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email readonly */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={clienteEmail}
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input
                id="senha"
                type={showSenha ? 'text' : 'password'}
                {...form.register('senha')}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.senha && (
              <p className="text-sm text-red-500">{form.formState.errors.senha.message}</p>
            )}

            {/* Validações visuais */}
            <div className="mt-3 space-y-1 rounded-md border p-3 bg-muted/50">
              <p className="text-sm font-medium mb-2">Sua senha deve conter:</p>
              <ValidationItem isValid={senhaValidation.minLength} label="Mínimo de 8 caracteres" />
              <ValidationItem isValid={senhaValidation.hasUpperCase} label="Uma letra maiúscula" />
              <ValidationItem isValid={senhaValidation.hasLowerCase} label="Uma letra minúscula" />
              <ValidationItem isValid={senhaValidation.hasNumber} label="Um número" />
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmarSenha"
                type={showConfirmarSenha ? 'text' : 'password'}
                {...form.register('confirmarSenha')}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.confirmarSenha && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmarSenha.message}</p>
            )}
          </div>

          {/* Botão Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Minha Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
