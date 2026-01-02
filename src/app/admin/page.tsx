'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/data/mock-data';
import { useStore } from '@/store/useStore';

export default function AdminDashboard() {
  // Get transactions from global store (will update when customer adds new transaction)
  const transactions = useStore((state) => state.transactions);

  const totalSuccess = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const successCount = transactions.filter((t) => t.status === 'success').length;
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500">Monitor transaksi top-up RFID</p>
        </div>

        {/* Info Banner */}
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-4">
          <p className="text-sm font-medium text-pertamina-blue">
            Sistem Otomatis Aktif - Real-time Update
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Verifikasi pembayaran dilakukan otomatis oleh Xendit. 
            Transaksi baru akan langsung muncul di tabel di bawah.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Berhasil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{successCount}</p>
              <p className="text-sm text-gray-500">{formatCurrency(totalSuccess)}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Menunggu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-sm text-gray-500">{formatCurrency(totalPending)}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pertamina-red">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Nilai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-pertamina-red">
                {formatCurrency(totalSuccess + totalPending)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi (Real-time)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Xendit ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-mono text-sm">{trx.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{trx.customerName}</p>
                        <p className="text-xs text-gray-500">{trx.virtualAccountNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{trx.bankCode}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(trx.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
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
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(trx.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {trx.xenditPaymentId || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Old vs New Comparison */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Perbandingan Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-red-50 p-4">
                <p className="font-medium text-red-800">Sistem Lama (IMPAZZ)</p>
                <ul className="mt-2 space-y-1 text-sm text-red-700">
                  <li>- Verifikasi manual oleh tim keuangan</li>
                  <li>- Cek rekening koran satu per satu</li>
                  <li>- Jam operasional terbatas</li>
                  <li>- Rawan human error</li>
                </ul>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="font-medium text-green-800">Sistem Baru (Xendit)</p>
                <ul className="mt-2 space-y-1 text-sm text-green-700">
                  <li>+ Verifikasi otomatis via webhook</li>
                  <li>+ Real-time, hitungan detik</li>
                  <li>+ 24/7 tanpa batas jam operasional</li>
                  <li>+ Tidak ada risiko human error</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
