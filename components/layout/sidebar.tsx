'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { RoleType } from '@/lib/types';
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Briefcase,
  UserCircle,
  ChevronLeft,
  Scale,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/formatters';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, perfil } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Usuários', icon: Users },
    { href: '/admin/config', label: 'Configurações', icon: Settings },
  ];

  const advogadoLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/advogado/clientes', label: 'Clientes', icon: UserCircle },
    { href: '/advogado/projetos', label: 'Projetos', icon: Briefcase },
  ];

  const clienteLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/cliente/meus-projetos', label: 'Meus Projetos', icon: FileText },
  ];

  const getLinks = () => {
    switch (perfil) {
      case RoleType.ADMIN:
        return adminLinks;
      case RoleType.ADVOGADO:
        return advogadoLinks;
      case RoleType.CLIENTE:
        return clienteLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo e Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-bold">Advocacia</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nome}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950',
            collapsed && 'justify-center px-2'
          )}
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}
