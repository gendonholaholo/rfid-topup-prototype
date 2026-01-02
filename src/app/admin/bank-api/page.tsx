'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate, bankCodes } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  Send,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react';

export default function BankAPIPage() {
  const bankStatements = useStore((state) => state.bankStatements);
  const addBankStatement = useStore((state) => state.addBankStatement);

  const [isConnected, setIsConnected] = useState(false);
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [isSimulating, setIsSimulating] = useState(false);

  // Form state for manual API simulation
  const [vaNumber, setVaNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [senderName, setSenderName] = useState('');

  // Filter API source statements
  const apiStatements = bankStatements.filter((s) => s.source === 'api');

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleSimulateAPICallback = async () => {
    if (!vaNumber || !amount) return;

    setIsSimulating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addBankStatement({
      source: 'api',
      bankCode: selectedBank,
      accountNumber: '1234567890',
      virtualAccountNumber: vaNumber,
      amount: Number(amount),
      transactionDate: new Date().toISOString(),
      senderName: senderName || undefined,
      reference: `API-${Date.now()}`,
    });

    setVaNumber('');
    setAmount('');
    setSenderName('');
    setIsSimulating(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'matched':
        return <Badge className="bg-blue-500">Matched</Badge>;
      case 'processed':
        return <Badge className="bg-green-500">Processed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bank API Integration</h1>
          <p className="text-muted-foreground">
            Simulasi integrasi API dengan sistem bank
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Status Koneksi Bank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  disabled={isConnected}
                >
                  {bankCodes.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <Wifi className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">Terhubung</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-5 w-5 text-gray-400" />
                      <span className="text-muted-foreground">Tidak terhubung</span>
                    </>
                  )}
                </div>
              </div>

              {isConnected ? (
                <Button variant="outline" onClick={handleDisconnect}>
                  Putuskan Koneksi
                </Button>
              ) : (
                <Button onClick={handleConnect}>Hubungkan ke Bank</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Simulator */}
        {isConnected && (
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Send className="h-5 w-5" />
                Simulasi Callback API Bank
              </CardTitle>
              <CardDescription>
                Simulasikan notifikasi pembayaran dari bank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Virtual Account</label>
                  <Input
                    placeholder="8810012345678901"
                    value={vaNumber}
                    onChange={(e) => setVaNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nominal</label>
                  <Input
                    type="number"
                    placeholder="10000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Pengirim</label>
                  <Input
                    placeholder="PT ABC Indonesia"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSimulateAPICallback}
                    disabled={!vaNumber || !amount || isSimulating}
                    className="w-full"
                  >
                    {isSimulating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSimulating ? 'Mengirim...' : 'Kirim Callback'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent API Statements */}
        <Card>
          <CardHeader>
            <CardTitle>Data dari Bank API</CardTitle>
            <CardDescription>
              Transaksi yang diterima melalui callback API bank
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiStatements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada data dari Bank API</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Virtual Account</TableHead>
                    <TableHead>Pengirim</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiStatements.map((stmt) => (
                    <TableRow key={stmt.id}>
                      <TableCell className="text-sm">{formatDate(stmt.createdAt)}</TableCell>
                      <TableCell><Badge variant="outline">{stmt.bankCode}</Badge></TableCell>
                      <TableCell className="font-mono text-sm">{stmt.virtualAccountNumber}</TableCell>
                      <TableCell>{stmt.senderName || '-'}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(stmt.amount)}</TableCell>
                      <TableCell>{getStatusBadge(stmt.status)}</TableCell>
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
