'use client';

import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TransactionStatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { mockRFIDCards, mockRFIDCardBalances, formatCurrency, formatDateShort } from '@/data/mock-data';
import { downloadCSV, csvFilename, type CSVColumn } from '@/lib/utils/download-csv';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const customers = useStore((state) => state.customers);
  const transactions = useStore((state) => state.transactions);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter((c) =>
      c.companyName.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const totalBalance = filteredCustomers.reduce((sum, c) => sum + c.balance, 0);
  const totalCards = filteredCustomers.reduce((sum, c) => sum + c.rfidCards.length, 0);

  const handleDownload = () => {
    const columns: CSVColumn<Customer>[] = [
      { header: 'ID', accessor: (c) => c.id },
      { header: 'Perusahaan', accessor: (c) => c.companyName },
      { header: 'Email', accessor: (c) => c.email },
      { header: 'Telepon', accessor: (c) => c.phone },
      { header: 'Virtual Account', accessor: (c) => c.virtualAccountNumber },
      { header: 'Saldo', accessor: (c) => c.balance },
      { header: 'Jumlah Kartu RFID', accessor: (c) => c.rfidCards.length },
      { header: 'Terdaftar', accessor: (c) => formatDateShort(c.createdAt) },
    ];
    downloadCSV(csvFilename('pelanggan'), columns, filteredCustomers);
  };

  const toggleDetail = (customerId: string) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pelanggan</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button className="bg-pertamina-red hover:bg-red-700">
              + Tambah Pelanggan
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Total Pelanggan</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-pertamina-red">
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Total Saldo Deposit</p>
              <p className="text-2xl font-bold text-pertamina-red">{formatCurrency(totalBalance)}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-pertamina-blue">
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Total Kartu RFID</p>
              <p className="text-2xl font-bold text-pertamina-blue">{totalCards}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Pelanggan Aktif</p>
              <p className="text-2xl font-bold text-green-600">{filteredCustomers.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <Input
                className="max-w-sm"
                placeholder="Cari nama perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>Reset</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pelanggan ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Virtual Account</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Kartu RFID</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const customerCardsList = mockRFIDCards.filter(
                    (c) => c.customerId === customer.id
                  );
                  const recentTrx = transactions
                    .filter((t) => t.customerId === customer.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3);

                  return (
                    <React.Fragment key={customer.id}>
                      <TableRow>
                        <TableCell className="font-mono text-sm">{customer.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.companyName}</p>
                            <p className="text-xs text-gray-500">{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{customer.email}</TableCell>
                        <TableCell className="font-mono text-sm">{customer.virtualAccountNumber}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(customer.balance)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer.rfidCards.length} kartu</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDetail(customer.id)}
                          >
                            {expandedCustomer === customer.id ? 'Tutup' : 'Detail'}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Detail Row */}
                      {expandedCustomer === customer.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-gray-50 p-4">
                            <div className="space-y-4">
                              {/* Customer Info */}
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Saldo Deposit</p>
                                  <p className="text-lg font-bold text-pertamina-red">
                                    {formatCurrency(customer.balance)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Total Kartu</p>
                                  <p className="text-lg font-bold">{customerCardsList.length}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Total Transaksi</p>
                                  <p className="text-lg font-bold">
                                    {transactions.filter((t) => t.customerId === customer.id).length}
                                  </p>
                                </div>
                              </div>

                              {/* RFID Cards */}
                              <div>
                                <p className="text-sm font-medium mb-2">Kartu RFID</p>
                                <div className="space-y-1">
                                  {customerCardsList.map((card) => (
                                    <div key={card.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                                      <span className="font-mono">{card.cardNumber}</span>
                                      <span className="text-gray-500">{card.vehiclePlate}</span>
                                      <span className="text-gray-500">{formatCurrency(mockRFIDCardBalances[card.id] || 0)}</span>
                                      <Badge
                                        className={
                                          card.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }
                                      >
                                        {card.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Recent Transactions */}
                              {recentTrx.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Transaksi Terbaru</p>
                                  <div className="space-y-1">
                                    {recentTrx.map((trx) => (
                                      <div key={trx.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                                        <span className="font-mono text-xs">{trx.id}</span>
                                        <span>{formatCurrency(trx.amount)}</span>
                                        <span className="text-gray-500">{trx.bankCode}</span>
                                        <span className="text-gray-500">{formatDateShort(trx.createdAt)}</span>
                                        <TransactionStatusBadge status={trx.status} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>

            {filteredCustomers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                Tidak ada pelanggan yang cocok dengan pencarian &quot;{searchQuery}&quot;
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
