'use client';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'admin';
}

export function MainLayout({ children, userType }: MainLayoutProps) {
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
