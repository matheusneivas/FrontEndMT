import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from './utils/validators';
import axios from 'axios';
import type { LoginResponse, User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('🔵 NextAuth - authorize chamado', { credentials });

          // Validate credentials
          const validated = loginSchema.parse(credentials);
          console.log('🔵 NextAuth - Credenciais validadas');

          // Call backend login endpoint
          console.log('🔵 NextAuth - Chamando backend:', `${API_URL}/api/auth/login`);
          const response = await axios.post<any>(
            `${API_URL}/api/auth/login`,
            validated
          );

          console.log('🔵 NextAuth - Resposta do backend:', response.data);

          // Backend wraps response in {data: {user, token}}
          const responseData = response.data?.data || response.data;

          if (responseData && (responseData.token || responseData.access_token) && responseData.user) {
            console.log('✅ NextAuth - Login autorizado');
            // Return user data with token
            return {
              id: responseData.user.id,
              email: responseData.user.email,
              nome: responseData.user.nome,
              role: responseData.user.perfil || responseData.user.role,
              ativo: responseData.user.ativo,
              accessToken: responseData.token || responseData.access_token,
            };
          }

          console.log('❌ NextAuth - Dados de resposta inválidos');
          return null;
        } catch (error: any) {
          console.error('❌ NextAuth - Erro:', error?.message || error);
          if (error?.response?.data) {
            console.error('❌ NextAuth - Resposta de erro do backend:', error.response.data);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token on signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nome = (user as any).nome;
        token.role = (user as any).role;
        token.ativo = (user as any).ativo;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user data in session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.nome = token.nome as string;
        session.user.role = token.role as any;
        session.user.ativo = token.ativo as boolean;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
