'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  History,
  Home,
  BarChart3,
  Plug,
  GitCompare,
  Receipt,
  Users,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const customerNavItems: NavItem[] = [
  { href: '/customer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customer/topup', label: 'Top-Up Saldo', icon: Wallet },
  { href: '/customer/cards', label: 'Kartu RFID', icon: CreditCard },
  { href: '/customer/history', label: 'Riwayat', icon: History },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/dashboard', label: 'Analytics', icon: BarChart3, badge: 'NEW' },
  { href: '/admin/integration', label: 'Integration Hub', icon: Plug, badge: 'NEW' },
  { href: '/admin/matching', label: 'Matching Engine', icon: GitCompare },
  { href: '/admin/transactions', label: 'Transaksi', icon: Receipt },
  { href: '/admin/customers', label: 'Pelanggan', icon: Users },
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
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
                'flex h-8 w-8 items-center justify-center rounded-md',
                isActive ? 'bg-white/20' : 'bg-gray-100'
              )}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded',
                  isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                )}>
                  {item.badge}
                </span>
              )}
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
