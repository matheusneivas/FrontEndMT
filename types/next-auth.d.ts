import { RoleType } from '@/lib/types';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    nome: string;
    role: RoleType;
    ativo: boolean;
    accessToken: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      nome: string;
      role: RoleType;
      ativo: boolean;
      accessToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    nome: string;
    role: RoleType;
    ativo: boolean;
    accessToken: string;
  }
}
