'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, ShieldCheck, Fuel, ArrowLeft, Loader2 } from 'lucide-react';

type RoleType = 'customer' | 'admin' | null;

const CREDENTIALS: Record<'customer' | 'admin', { userId: string; password: string }> = {
  customer: { userId: 'CUST-001', password: 'demo1234' },
  admin: { userId: 'admin', password: 'admin1234' },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (role: 'customer' | 'admin') => {
    setSelectedRole(role);
    setUserId(CREDENTIALS[role].userId);
    setPassword(CREDENTIALS[role].password);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setUserId('');
    setPassword('');
  };

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push(selectedRole === 'admin' ? '/admin' : '/customer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-pertamina-red flex items-center justify-center">
              <Fuel className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pertamina Retail</h1>
            <p className="text-lg text-gray-600 mt-1">RFID Top-Up System</p>
          </div>
        </div>

        {/* Role Cards — shown when no role selected */}
        {!selectedRole && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="group cursor-pointer border-2 border-transparent hover:border-pertamina-red hover:shadow-lg transition-all duration-200"
              onClick={() => handleSelectRole('customer')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Masuk sebagai Customer</h2>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-pertamina-red group-hover:underline">
                  Pilih &rarr;
                </span>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer border-2 border-transparent hover:border-pertamina-blue hover:shadow-lg transition-all duration-200"
              onClick={() => handleSelectRole('admin')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                    <ShieldCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Masuk sebagai Admin</h2>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-pertamina-blue group-hover:underline">
                  Pilih &rarr;
                </span>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Login Form — shown when role is selected */}
        {selectedRole && (
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Login {selectedRole === 'admin' ? 'Admin' : 'Customer'}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID Pengguna</label>
                  <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Masukkan ID pengguna"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} disabled={isLoading} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button
                  onClick={handleLogin}
                  disabled={!userId || !password || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Prototype Demo &mdash; Xendit Payment Gateway Integration
        </p>
      </div>
    </div>
  );
}
