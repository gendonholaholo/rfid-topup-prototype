'use client';

import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionStatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  FileText,
} from 'lucide-react';

export default function CustomerDashboard() {
  const customer = useStore((state) => state.customer);
  const transactions = useStore((state) => state.transactions);

  const recentTransactions = transactions
    .filter((t) => t.customerId === customer.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <MainLayout userType="customer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang, {customer.companyName}
          </p>
        </div>

        {/* Balance & VA Card */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Saldo RFID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(customer.balance)}</p>
              <p className="text-sm opacity-90 mt-1">
                {customer.rfidCards.length} kartu terdaftar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Virtual Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold tracking-wider">
                {customer.virtualAccountNumber}
              </p>
              <p className="text-sm opacity-90 mt-1">
                Transfer ke VA ini untuk top-up
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link href="/customer/topup">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Top-Up Saldo
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/customer/history">
              <FileText className="mr-2 h-4 w-4" />
              Riwayat
            </Link>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada transaksi
              </p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const isFailed = tx.status === 'failed';
                  const isPending = tx.status === 'pending';
                  return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isPending
                        ? 'bg-yellow-50 dark:bg-yellow-950/20'
                        : isFailed
                          ? 'bg-red-50 dark:bg-red-950/20'
                          : 'bg-green-50 dark:bg-green-950/20'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${
                        isPending
                          ? 'text-yellow-700 dark:text-yellow-300'
                          : isFailed
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-green-700 dark:text-green-300'
                      }`}>
                        +{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(tx.createdAt)} &middot; {tx.bankCode}
                      </p>
                    </div>
                    <TransactionStatusBadge status={tx.status} />
                  </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
