'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTransactions, formatCurrency } from '@/data/mock-data';

export default function AdminTransactionsPage() {
  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Transaksi</h1>
          <p className="text-gray-500">Semua transaksi top-up RFID</p>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4">
              <Input type="date" className="w-auto" placeholder="Dari" />
              <Input type="date" className="w-auto" placeholder="Sampai" />
              <Input className="w-48" placeholder="Cari pelanggan..." />
              <select className="rounded-md border px-3 py-2 text-sm">
                <option value="">Semua Status</option>
                <option value="success">Berhasil</option>
                <option value="pending">Menunggu</option>
                <option value="failed">Gagal</option>
              </select>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export Excel</Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi ({mockTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>VA</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu Dibuat</TableHead>
                  <TableHead>Waktu Bayar</TableHead>
                  <TableHead>Xendit ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-mono text-sm">{trx.id}</TableCell>
                    <TableCell className="font-medium">{trx.customerName}</TableCell>
                    <TableCell className="font-mono text-sm">{trx.virtualAccountNumber}</TableCell>
                    <TableCell>{trx.bankCode}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(trx.amount)}</TableCell>
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
                      {new Date(trx.createdAt).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {trx.paidAt ? new Date(trx.paidAt).toLocaleString('id-ID') : '-'}
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

        {/* Info Note */}
        <Card className="border-dashed bg-blue-50">
          <CardContent className="py-4">
            <p className="text-sm text-pertamina-blue">
              <span className="font-medium">Info:</span> Semua transaksi diverifikasi otomatis oleh Xendit. 
              Tim keuangan tidak perlu melakukan approval manual seperti di sistem IMPAZZ sebelumnya.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
