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
import { mockCustomers, formatCurrency } from '@/data/mock-data';

export default function AdminCustomersPage() {
  const totalBalance = mockCustomers.reduce((sum, c) => sum + c.balance, 0);
  const totalCards = mockCustomers.reduce((sum, c) => sum + c.rfidCards.length, 0);

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Pelanggan</h1>
            <p className="text-gray-500">Kelola pelanggan RFID</p>
          </div>
          <Button className="bg-pertamina-red hover:bg-red-700">
            + Tambah Pelanggan
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-500">Total Pelanggan</p>
              <p className="text-2xl font-bold text-gray-900">{mockCustomers.length}</p>
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
              <p className="text-2xl font-bold text-green-600">{mockCustomers.length}</p>
            </CardContent>
          </Card>
        </div>


        {/* Search */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <Input className="max-w-sm" placeholder="Cari nama perusahaan..." />
              <Button variant="outline">Cari</Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pelanggan</CardTitle>
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
                {mockCustomers.map((customer) => (
                  <TableRow key={customer.id}>
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
                      <Button variant="outline" size="sm">Detail</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
