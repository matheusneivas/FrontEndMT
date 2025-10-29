import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { RoleType } from './types';

export async function auth(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const path = request.nextUrl.pathname;

  // Public paths
  if (path.startsWith('/auth')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected paths - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const userRole = token.role as RoleType;

  // Role-based access control
  if (path.startsWith('/admin') && userRole !== RoleType.ADMIN) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path.startsWith('/advogado') && userRole !== RoleType.ADVOGADO && userRole !== RoleType.ADMIN) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path.startsWith('/cliente') && userRole !== RoleType.CLIENTE) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
