'use client';

import { use } from 'react';
import { ProjetoNav } from '@/components/projetos/projeto-nav';

interface ProjetoLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function ProjetoLayout({ children, params }: ProjetoLayoutProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-col h-full">
      <ProjetoNav projetoId={id} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
