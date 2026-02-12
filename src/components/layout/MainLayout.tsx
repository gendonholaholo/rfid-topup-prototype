'use client';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useTransactionExpiry } from '@/lib/hooks/useTransactionExpiry';

interface MainLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'admin';
}

export function MainLayout({ children, userType }: MainLayoutProps) {
  useTransactionExpiry();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType={userType} />
      <Sidebar userType={userType} />
      <main className="ml-64 min-h-[calc(100vh-4rem)] p-6">
        {children}
      </main>
    </div>
  );
}
