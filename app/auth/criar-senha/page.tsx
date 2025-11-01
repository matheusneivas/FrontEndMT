'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CriarSenhaForm } from '@/components/auth/criar-senha-form';
import { authApi } from '@/lib/api/auth';
import type { ValidarTokenResponse } from '@/lib/types';

type ValidationState = 'validating' | 'valid' | 'invalid';

export default function CriarSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [validationState, setValidationState] = useState<ValidationState>('validating');
  const [tokenData, setTokenData] = useState<ValidarTokenResponse | null>(null);

  useEffect(() => {
    if (!token) {
      setValidationState('invalid');
      setTokenData({
        valido: false,
        motivo: 'Token não fornecido na URL',
      });
      return;
    }

    const validateToken = async () => {
      try {
        const response = await authApi.validarTokenAtivacao(token);
        setTokenData(response);

        if (response.valido) {
          setValidationState('valid');
        } else {
          setValidationState('invalid');
        }
      } catch (error: any) {
        console.error('Erro ao validar token:', error);
        setValidationState('invalid');
        setTokenData({
          valido: false,
          motivo: error?.response?.data?.message || 'Erro ao validar token. Tente novamente.',
        });
      }
    };

    validateToken();
  }, [token]);

  const handleSuccess = () => {
    router.push('/auth/login');
  };

  // Loading state
  if (validationState === 'validating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Validando seu link...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-center">
              Por favor, aguarde enquanto validamos seu convite
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (validationState === 'invalid') {
    const getErrorDetails = () => {
      const motivo = tokenData?.motivo || 'Token inválido';

      if (motivo.toLowerCase().includes('expirado')) {
        return {
          title: 'Link Expirado',
          description: 'Este link de ativação expirou. Por favor, entre em contato com o escritório para receber um novo convite.',
          icon: <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />,
        };
      }

      if (motivo.toLowerCase().includes('usado') || motivo.toLowerCase().includes('já')) {
        return {
          title: 'Link Já Utilizado',
          description: 'Este link já foi utilizado. Se você já criou sua senha, faça login. Caso contrário, entre em contato com o escritório.',
          icon: <CheckCircle2 className="h-12 w-12 text-blue-500 mb-4" />,
        };
      }

      return {
        title: 'Link Inválido',
        description: motivo,
        icon: <AlertCircle className="h-12 w-12 text-red-500 mb-4" />,
      };
    };

    const errorDetails = getErrorDetails();

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">{errorDetails.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {errorDetails.icon}
            <Alert className="mb-4">
              <AlertDescription className="text-center">
                {errorDetails.description}
              </AlertDescription>
            </Alert>

            <div className="w-full space-y-2">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full"
                variant="default"
              >
                Ir para Login
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-4">
                Precisa de ajuda? Entre em contato com o escritório.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid token - show form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <CriarSenhaForm
        token={token!}
        clienteNome={tokenData?.cliente?.nome || 'Cliente'}
        clienteEmail={tokenData?.cliente?.email || ''}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
