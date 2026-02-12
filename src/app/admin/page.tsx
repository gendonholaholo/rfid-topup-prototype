'use client';

import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Receipt,
  Users,
  ArrowRight,
  Wallet,
  Activity,
} from 'lucide-react';

export default function AdminDashboard() {
  const transactions = useStore((state) => state.transactions);
  const customers = useStore((state) => state.customers);
  const getDashboardStats = useStore((state) => state.getDashboardStats);

  const stats = getDashboardStats();

  const totalAmount = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalTransactionsToday}</p>
                  <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalAmountToday)}</p>
                  <p className="text-sm text-muted-foreground">Amount Hari Ini</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.transactionsThisMonth}</p>
                  <p className="text-sm text-muted-foreground">Transaksi Bulan Ini</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeCustomers}</p>
                  <p className="text-sm text-muted-foreground">Customer Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Amount Card */}
        <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <CardContent className="p-6">
            <p className="text-sm opacity-90">Total Top-Up (Semua Waktu)</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalAmount)}</p>
            <p className="text-sm opacity-75 mt-1">{transactions.length} transaksi dari {customers.length} customer</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="h-5 w-5 text-blue-500" />
                Lihat Semua Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/transactions">
                  Buka Daftar Transaksi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-green-500" />
                Kelola Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/customers">
                  Buka Daftar Pelanggan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </MainLayout>
  );
}
