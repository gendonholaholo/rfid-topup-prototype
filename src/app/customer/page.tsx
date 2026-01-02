'use client';

import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';

export default function CustomerDashboard() {
  const customer = useStore((state) => state.customer);
  const webreportSubmissions = useStore((state) => state.webreportSubmissions);
  const transactions = useStore((state) => state.transactions);

  // Filter submissions for this customer
  const mySubmissions = webreportSubmissions.filter(
    (s) => s.customerId === customer.id
  );
  const pendingSubmissions = mySubmissions.filter((s) => s.status === 'pending');
  const recentSubmissions = mySubmissions.slice(0, 5);

  // Recent successful transactions
  const recentTransactions = transactions
    .filter((t) => t.customerId === customer.id && t.status === 'success')
    .slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Menunggu
          </Badge>
        );
      case 'matched':
        return (
          <Badge className="gap-1 bg-blue-500">
            <FileText className="h-3 w-3" />
            Dicocokkan
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Terverifikasi
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Ditolak
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                {customer.rfidCards.length} kartu aktif
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
              Lapor Top-Up
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/customer/history">
              <FileText className="mr-2 h-4 w-4" />
              Riwayat
            </Link>
          </Button>
        </div>

        {/* Pending Submissions Alert */}
        {pendingSubmissions.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {pendingSubmissions.length} laporan menunggu verifikasi
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Saldo akan bertambah setelah diverifikasi sistem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Laporan Top-Up Terbaru</CardTitle>
            <CardDescription>
              Status laporan transfer Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada laporan top-up
              </p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{formatCurrency(submission.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(submission.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top-Up Berhasil</CardTitle>
              <CardDescription>
                Transaksi yang sudah terverifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-300">
                        +{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                    <Badge className="bg-green-500 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Berhasil
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
