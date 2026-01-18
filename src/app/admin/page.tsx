'use client';

import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  FileText,
  Building2,
  GitCompare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Wifi,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const webreportSubmissions = useStore((state) => state.webreportSubmissions);
  const bankStatements = useStore((state) => state.bankStatements);
  const matchingResults = useStore((state) => state.matchingResults);
  const transactions = useStore((state) => state.transactions);

  const pendingWebreports = webreportSubmissions.filter((w) => w.status === 'pending');
  const pendingBankStatements = bankStatements.filter((b) => b.status === 'pending');
  const pendingMatches = matchingResults.filter(
    (m) => m.status === 'auto_matched' || m.status === 'manual_review'
  );
  const verifiedToday = matchingResults.filter((m) => {
    if (m.status !== 'verified') return false;
    const today = new Date().toISOString().split('T')[0];
    return m.verifiedAt?.startsWith(today);
  });

  const totalVerifiedAmount = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Automation Engine - Verifikasi Top-Up RFID
          </p>
        </div>

        {/* Alert for pending items */}
        {(pendingWebreports.length > 0 || pendingBankStatements.length > 0) && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Ada data yang perlu diproses
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {pendingWebreports.length} webreport & {pendingBankStatements.length} bank statement menunggu matching
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href="/admin/matching">
                    Proses Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingWebreports.length}</p>
                  <p className="text-sm text-muted-foreground">Webreport Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingBankStatements.length}</p>
                  <p className="text-sm text-muted-foreground">Bank Statement Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingMatches.length}</p>
                  <p className="text-sm text-muted-foreground">Perlu Verifikasi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{verifiedToday.length}</p>
                  <p className="text-sm text-muted-foreground">Verified Hari Ini</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Amount Card */}
        <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <CardContent className="p-6">
            <p className="text-sm opacity-90">Total Top-Up Terverifikasi</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalVerifiedAmount)}</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-500" />
                Integrasi Bank
              </CardTitle>
              <CardDescription>
                Terima data rekening koran via Webhook atau File Import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/integration-demo">
                  <Wifi className="mr-2 h-4 w-4 text-green-500" />
                  Webhook (Real-time)
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/integration-demo?tab=file">
                  <Upload className="mr-2 h-4 w-4 text-purple-500" />
                  File Import (Batch)
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GitCompare className="h-5 w-5 text-green-500" />
                Matching Engine
              </CardTitle>
              <CardDescription>
                Cocokkan dan verifikasi data webreport dengan bank statement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-pertamina-red hover:bg-red-700">
                <Link href="/admin/matching">
                  Buka Matching
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Flow Diagram */}
        <Card>
          <CardHeader>
            <CardTitle>Alur Automation Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 py-4 overflow-x-auto">
              <div className="text-center min-w-[120px]">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Webreport</p>
                <p className="text-xs text-muted-foreground">Customer upload</p>
              </div>

              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

              <div className="text-center min-w-[120px]">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-2">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Bank Statement</p>
                <p className="text-xs text-muted-foreground">API / File Import</p>
              </div>

              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

              <div className="text-center min-w-[120px]">
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto mb-2">
                  <GitCompare className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-sm font-medium">Matching</p>
                <p className="text-xs text-muted-foreground">VA + Nominal</p>
              </div>

              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

              <div className="text-center min-w-[120px]">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-xs text-muted-foreground">Saldo updated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
