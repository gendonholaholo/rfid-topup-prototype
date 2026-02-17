'use client';

import { useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateFilter } from '@/components/ui/date-filter';
import { TransactionStatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate } from '@/data/mock-data';
import { useStore } from '@/store/useStore';
import { useDateFilter } from '@/lib/hooks/useDateFilter';
import { Clock, X, Check, Download } from 'lucide-react';
import { downloadCSV, csvFilename, type CSVColumn } from '@/lib/utils/download-csv';
import { Transaction } from '@/types';

export default function HistoryPage() {
  const customer = useStore((state) => state.customer);
  const transactions = useStore((state) => state.transactions);

  const customerTransactions = transactions.filter((t) => t.customerId === customer.id);
  const getDate = useCallback((t: { createdAt: string }) => t.createdAt, []);
  const { dateFrom, setDateFrom, dateTo, setDateTo, filtered, reset, hasFilter } = useDateFilter(customerTransactions, getDate);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDownload = () => {
    const columns: CSVColumn<Transaction>[] = [
      { header: 'ID', accessor: (t) => t.id },
      { header: 'Bank', accessor: (t) => t.bankCode },
      { header: 'Nominal', accessor: (t) => t.amount },
      { header: 'Status', accessor: (t) => t.status },
      { header: 'Waktu', accessor: (t) => formatDate(t.createdAt) },
    ];
    downloadCSV(csvFilename('riwayat-transaksi'), columns, sorted);
  };

  return (
    <MainLayout userType="customer">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>

        <DateFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onReset={reset}
          hasFilter={hasFilter}
        >
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DateFilter>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi ({sorted.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sorted.map((trx) => {
                const isPending = trx.status === 'pending';
                const isFailed = trx.status === 'failed';

                return (
                  <div
                    key={trx.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isPending
                          ? 'bg-yellow-100 text-yellow-600'
                          : isFailed
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                      }`}>
                        {isPending ? (
                          <Clock className="h-5 w-5" />
                        ) : isFailed ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
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
                        {isPending && trx.expiresAt && (
                          <p className="text-xs text-yellow-600 mt-0.5">
                            Menunggu pembayaran &middot; Batas waktu{' '}
                            {new Date(trx.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(trx.amount)}
                      </p>
                      <TransactionStatusBadge status={trx.status} />
                    </div>
                  </div>
                );
              })}
            </div>

            {sorted.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                {hasFilter
                  ? 'Tidak ada transaksi pada rentang tanggal yang dipilih'
                  : 'Belum ada transaksi'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
