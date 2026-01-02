'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/data/mock-data';
import { useStore, generateTransactionId, generateXenditId } from '@/store/useStore';
import { Transaction } from '@/types';

export default function TopUpPage() {
  const [step, setStep] = useState<'info' | 'transfer' | 'success'>('info');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastXenditId, setLastXenditId] = useState<string>('');

  // Get state and actions from store
  const customer = useStore((state) => state.customer);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateCustomerBalance = useStore((state) => state.updateCustomerBalance);

  const quickAmounts = [500000, 1000000, 2000000, 5000000, 10000000];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    
    // Simulate webhook callback from Xendit (3 second delay)
    setTimeout(() => {
      const xenditId = generateXenditId();
      const now = new Date().toISOString();
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: generateTransactionId(),
        customerId: customer.id,
        customerName: customer.companyName,
        virtualAccountNumber: customer.virtualAccountNumber,
        amount: Number(amount),
        status: 'success',
        paymentMethod: 'Virtual Account',
        bankCode: 'BCA',
        xenditPaymentId: xenditId,
        paidAt: now,
        createdAt: now,
        updatedAt: now,
      };

      // Add transaction to store (will appear in admin dashboard)
      addTransaction(newTransaction);
      
      // Update customer balance
      updateCustomerBalance(Number(amount));
      
      // Save xendit ID for display
      setLastXenditId(xenditId);
      
      setIsProcessing(false);
      setStep('success');
    }, 3000);
  };

  return (
    <MainLayout userType="customer">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top-Up Saldo</h1>
          <p className="text-gray-500">Tambah saldo deposit RFID Anda</p>
        </div>

        {/* Current Balance */}
        <Card className="border-pertamina-red bg-gradient-to-r from-red-50 to-white">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo Saat Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(customer.balance)}
                </p>
              </div>
              <Badge className="bg-pertamina-red">Fixed VA</Badge>
            </div>
          </CardContent>
        </Card>

        {step === 'info' && (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Virtual Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-pertamina-blue bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Nomor Virtual Account Anda</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-mono font-bold text-pertamina-blue">
                    {customer.virtualAccountNumber}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(customer.virtualAccountNumber)}
                  >
                    Salin
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">Bank: BCA (Xendit)</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Cara Top-Up:</h3>
                <ol className="list-inside list-decimal space-y-2 text-sm text-gray-600">
                  <li>Transfer ke nomor VA di atas melalui ATM, Mobile Banking, atau Internet Banking</li>
                  <li>Masukkan nominal yang ingin di top-up (minimal Rp 100.000)</li>
                  <li>Selesaikan pembayaran</li>
                  <li>Saldo akan otomatis bertambah dalam hitungan detik</li>
                </ol>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Saldo otomatis masuk tanpa perlu upload bukti transfer!
                </p>
                <p className="mt-1 text-xs text-green-600">
                  Sistem pembayaran terintegrasi dengan Xendit Payment Gateway
                </p>
              </div>

              <Button
                className="w-full bg-pertamina-red hover:bg-red-700"
                onClick={() => setStep('transfer')}
              >
                Lanjut ke Simulasi Transfer
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'transfer' && (
          <Card>
            <CardHeader>
              <CardTitle>Simulasi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Demo: Pilih nominal untuk simulasi pembayaran via Xendit
              </p>

              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant={amount === String(amt) ? 'default' : 'outline'}
                    className={amount === String(amt) ? 'bg-pertamina-red' : ''}
                    onClick={() => setAmount(String(amt))}
                  >
                    {formatCurrency(amt)}
                  </Button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Atau masukkan nominal lain:
                </label>
                <Input
                  type="number"
                  placeholder="Masukkan nominal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>

              {amount && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Transfer:</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(Number(amount))}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('info')}>
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-pertamina-red hover:bg-red-700"
                  disabled={!amount || isProcessing}
                  onClick={handleSimulatePayment}
                >
                  {isProcessing ? 'Memproses Pembayaran...' : 'Simulasi Bayar via Xendit'}
                </Button>
              </div>

              {isProcessing && (
                <div className="rounded-lg bg-yellow-50 p-4 text-center">
                  <p className="text-sm font-medium text-yellow-800">
                    Menunggu konfirmasi dari Xendit...
                  </p>
                  <p className="mt-1 text-xs text-yellow-600">
                    Webhook callback sedang diproses
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl text-green-600">OK</span>
              </div>
              <h2 className="text-xl font-bold text-green-800">
                Top-Up Berhasil!
              </h2>
              <p className="mt-2 text-green-600">
                Saldo Anda telah bertambah {formatCurrency(Number(amount))}
              </p>
              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-sm text-gray-500">Saldo Terbaru</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(customer.balance)}
                </p>
              </div>
              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-800">
                  Xendit Payment ID: {lastXenditId}
                </p>
              </div>
              <p className="mt-4 text-sm text-green-700">
                Transaksi ini sudah muncul di Dashboard Admin!
              </p>
              <Button
                className="mt-6 bg-pertamina-red hover:bg-red-700"
                onClick={() => {
                  setStep('info');
                  setAmount('');
                }}
              >
                Top-Up Lagi
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
