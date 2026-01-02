'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/data/mock-data';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function CustomerDashboard() {
  // Get data from global store
  const customer = useStore((state) => state.customer);
  const transactions = useStore((state) => state.transactions);
  
  const recentTransactions = transactions
    .filter(t => t.customerId === customer.id)
    .slice(0, 5);

  return (
    <MainLayout userType="customer">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Selamat datang, {customer.companyName}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Saldo Card */}
          <Card className="border-l-4 border-l-pertamina-red">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Saldo Deposit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(customer.balance)}
              </p>
              <Link href="/customer/topup">
                <Button className="mt-3 w-full bg-pertamina-red hover:bg-red-700">
                  Top-Up Saldo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* VA Card */}
          <Card className="border-l-4 border-l-pertamina-blue">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Virtual Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-mono font-bold text-gray-900">
                {customer.virtualAccountNumber}
              </p>
              <p className="mt-1 text-sm text-gray-500">Bank BCA</p>
              <Button variant="outline" className="mt-3 w-full" onClick={() => {
                navigator.clipboard.writeText(customer.virtualAccountNumber);
              }}>
                Salin Nomor VA
              </Button>
            </CardContent>
          </Card>

          {/* Cards Count */}
          <Card className="border-l-4 border-l-pertamina-green">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Kartu RFID Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {customer.totalCards} Kartu
              </p>
              <p className="mt-1 text-sm text-gray-500">Terdaftar di akun Anda</p>
              <Link href="/customer/cards">
                <Button variant="outline" className="mt-3 w-full">
                  Lihat Kartu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Top-Up via {trx.bankCode}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(trx.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(trx.amount)}
                    </p>
                    <Badge
                      variant={trx.status === 'success' ? 'default' : 'secondary'}
                      className={
                        trx.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : trx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {trx.status === 'success'
                        ? 'Berhasil'
                        : trx.status === 'pending'
                        ? 'Menunggu'
                        : 'Gagal'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/customer/history">
              <Button variant="outline" className="mt-4 w-full">
                Lihat Semua Riwayat
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
