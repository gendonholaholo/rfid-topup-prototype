'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const customerNavItems: NavItem[] = [
  { href: '/customer', label: 'Dashboard', icon: 'D' },
  { href: '/customer/topup', label: 'Top-Up Saldo', icon: 'T' },
  { href: '/customer/cards', label: 'Kartu RFID', icon: 'K' },
  { href: '/customer/history', label: 'Riwayat', icon: 'R' },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'D' },
  { href: '/admin/transactions', label: 'Transaksi', icon: 'T' },
  { href: '/admin/customers', label: 'Pelanggan', icon: 'P' },
];

interface SidebarProps {
  userType: 'customer' | 'admin';
}

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  const navItems = userType === 'customer' ? customerNavItems : adminNavItems;

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-pertamina-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold',
                isActive ? 'bg-white/20' : 'bg-gray-100'
              )}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Demo Mode Switcher */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-lg border bg-gray-50 p-3">
          <p className="mb-2 text-xs font-medium text-gray-500">Demo Mode</p>
          <div className="flex gap-2">
            <Link
              href="/customer"
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors',
                userType === 'customer'
                  ? 'bg-pertamina-red text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              )}
            >
              Customer
            </Link>
            <Link
              href="/admin"
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors',
                userType === 'admin'
                  ? 'bg-pertamina-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              )}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
