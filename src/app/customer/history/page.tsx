'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/data/mock-data';
import { useStore } from '@/store/useStore';

export default function HistoryPage() {
  // Get data from global store
  const customer = useStore((state) => state.customer);
  const transactions = useStore((state) => state.transactions);
  
  const customerTransactions = transactions.filter(
    (t) => t.customerId === customer.id
  );

  return (
    <MainLayout userType="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-500">Histori top-up saldo RFID Anda</p>
        </div>

        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <Input type="date" className="w-auto" />
              <Input type="date" className="w-auto" />
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        trx.status === 'success'
                          ? 'bg-green-100 text-green-600'
                          : trx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {trx.status === 'success' ? 'OK' : trx.status === 'pending' ? '...' : 'X'}
                    </div>
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
                      {trx.xenditPaymentId && (
                        <p className="mt-1 font-mono text-xs text-gray-400">
                          {trx.xenditPaymentId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(trx.amount)}
                    </p>
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
                        ? 'Menunggu Pembayaran'
                        : 'Gagal'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {customerTransactions.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Belum ada transaksi
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
