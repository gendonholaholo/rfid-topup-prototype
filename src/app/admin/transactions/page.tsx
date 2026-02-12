'use client';

import { useState, useMemo, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TransactionStatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateFilter } from '@/components/ui/date-filter';
import { formatCurrency, formatDate } from '@/data/mock-data';
import { useStore } from '@/store/useStore';
import { useDateFilter } from '@/lib/hooks/useDateFilter';
export default function AdminTransactionsPage() {
  const transactions = useStore((state) => state.transactions);
  const [searchQuery, setSearchQuery] = useState('');

  const getDate = useCallback((t: { createdAt: string }) => t.createdAt, []);
  const { dateFrom, setDateFrom, dateTo, setDateTo, filtered: dateFiltered, reset: resetDates, hasFilter: hasDateFilter } = useDateFilter(transactions, getDate);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const base = !searchQuery.trim()
      ? dateFiltered
      : dateFiltered.filter(
          (t) =>
            t.customerName.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query) ||
            t.bankCode.toLowerCase().includes(query)
        );
    return [...base].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [dateFiltered, searchQuery]);

  const handleReset = () => {
    resetDates();
    setSearchQuery('');
  };

  const totalAmount = filteredTransactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Transaksi</h1>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <p className="text-2xl font-bold">{filteredTransactions.length}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Status</p>
              {(() => {
                const pendingCount = filteredTransactions.filter((t) => t.status === 'pending').length;
                const failedCount = filteredTransactions.filter((t) => t.status === 'failed').length;
                if (pendingCount > 0) {
                  return <p className="text-2xl font-bold text-yellow-600">{pendingCount} Pending</p>;
                } else if (failedCount > 0) {
                  return <p className="text-2xl font-bold text-red-600">{failedCount} Gagal</p>;
                } else {
                  return <p className="text-2xl font-bold text-blue-600">Semua Sukses</p>;
                }
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <DateFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onReset={handleReset}
          hasFilter={hasDateFilter || !!searchQuery}
        >
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Cari</label>
            <Input
              className="w-48"
              placeholder="Cari pelanggan/ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DateFilter>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {searchQuery || dateFrom || dateTo
                  ? 'Tidak ada transaksi yang cocok dengan filter'
                  : 'Belum ada transaksi'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>VA</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-mono text-sm">{trx.id}</TableCell>
                      <TableCell className="font-medium">{trx.customerName}</TableCell>
                      <TableCell className="font-mono text-sm">{trx.virtualAccountNumber}</TableCell>
                      <TableCell>{trx.bankCode}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(trx.amount)}
                      </TableCell>
                      <TableCell>
                        <TransactionStatusBadge status={trx.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(trx.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
