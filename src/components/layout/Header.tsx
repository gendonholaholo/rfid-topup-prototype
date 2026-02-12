'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockCustomer } from '@/data/mock-data';

interface HeaderProps {
  userType: 'customer' | 'admin';
}

export function Header({ userType }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pertamina-red">
            <span className="text-lg font-bold text-white">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Pertamina Retail
            </h1>
            <p className="text-xs text-gray-500">RFID Top-Up System</p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {userType === 'customer' ? mockCustomer.companyName : 'Administrator'}
            </p>
            <p className="text-xs text-gray-500">
              {userType === 'customer' ? 'Customer' : 'Tim Keuangan'}
            </p>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-pertamina-red text-white">
              {userType === 'customer' ? 'MJ' : 'AD'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
