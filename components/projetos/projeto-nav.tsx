'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Activity,
  DollarSign,
  ClipboardList,
  FolderOpen,
} from 'lucide-react';

interface ProjetoNavProps {
  projetoId: string;
}

export function ProjetoNav({ projetoId }: ProjetoNavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: `/advogado/projetos/${projetoId}`,
      label: 'Visão Geral',
      icon: FolderOpen,
      exact: true,
    },
    {
      href: `/advogado/projetos/${projetoId}/etapas`,
      label: 'Etapas',
      icon: ClipboardList,
    },
    {
      href: `/advogado/projetos/${projetoId}/atividades`,
      label: 'Atividades',
      icon: Activity,
    },
    {
      href: `/advogado/projetos/${projetoId}/documentos`,
      label: 'Documentos',
      icon: FileText,
    },
    {
      href: `/advogado/projetos/${projetoId}/tributario`,
      label: 'Tributário',
      icon: DollarSign,
    },
    {
      href: `/advogado/projetos/${projetoId}/participantes`,
      label: 'Participantes',
      icon: Users,
    },
  ];

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto">
        <nav className="flex overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'rounded-none border-b-2 border-transparent gap-2 h-12',
                    isActive && 'border-primary text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
