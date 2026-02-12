'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency, bankCodes, PENDING_EXPIRY_MINUTES } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  CreditCard,
  ArrowRight,
  Clock,
  Building2,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Transaction } from '@/types';

type Step = 'form' | 'confirm' | 'pending' | 'success';

export default function TopUpPage() {
  const customer = useStore((state) => state.customer);
  const submitTopup = useStore((state) => state.submitTopup);
  const confirmTransaction = useStore((state) => state.confirmTransaction);

  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTx, setSubmittedTx] = useState<Transaction | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const quickAmounts = [1000000, 2000000, 5000000, 10000000];

  const handleSubmit = () => {
    if (!amount || !bankCode) return;
    setStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transaction = submitTopup(Number(amount), bankCode, notes || undefined);
    setSubmittedTx(transaction);
    setIsSubmitting(false);
    setStep('pending');

    // Simulate Xendit webhook callback after ~5 seconds
    timeoutRef.current = setTimeout(() => {
      confirmTransaction(transaction.id);
      setStep('success');
    }, 5000);
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStep('form');
    setAmount('');
    setBankCode('');
    setNotes('');
    setSubmittedTx(null);
  };

  const expiryTime = submittedTx?.expiresAt
    ? new Date(submittedTx.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <MainLayout userType="customer">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Top-Up Saldo</h1>

        {/* VA Info Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm opacity-90">Virtual Account Anda</span>
            </div>
            <p className="text-2xl font-mono font-bold tracking-wider">
              {customer.virtualAccountNumber}
            </p>
            <p className="text-sm mt-2 opacity-90">{customer.companyName}</p>
          </CardContent>
        </Card>

        {/* Step: Form */}
        {step === 'form' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Form Top-Up Saldo
              </CardTitle>
              <CardDescription>
                Pilih bank penerima dan nominal top-up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nominal Top-Up</label>
                <Input
                  type="number"
                  placeholder="Masukkan nominal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts.map((qa) => (
                    <Button
                      key={qa}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(qa.toString())}
                      className={amount === qa.toString() ? 'border-primary' : ''}
                    >
                      {formatCurrency(qa)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bank */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank Penerima
                </label>
                <select
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Pilih bank...</option>
                  {bankCodes.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Catatan (Opsional)
                </label>
                <Input
                  placeholder="Contoh: Top-up bulan Februari"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!amount || !bankCode}
                className="w-full"
                size="lg"
              >
                Lanjutkan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <Card>
            <CardHeader>
              <CardTitle>Konfirmasi Top-Up</CardTitle>
              <CardDescription>
                Pastikan data berikut sudah benar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Virtual Account</span>
                  <span className="font-mono">{customer.virtualAccountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nominal</span>
                  <span className="font-bold text-lg">{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank Penerima</span>
                  <span>{bankCodes.find((b) => b.code === bankCode)?.name}</span>
                </div>
                {notes && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catatan</span>
                    <span>{notes}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                  Kembali
                </Button>
                <Button onClick={handleConfirmSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Pending */}
        {step === 'pending' && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                  Menunggu Pembayaran
                </h2>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Silakan transfer ke Virtual Account sebelum pukul {expiryTime}.
                  Transaksi akan otomatis dibatalkan jika melewati batas waktu ({PENDING_EXPIRY_MINUTES} menit).
                </p>
              </div>

              <div className="bg-white dark:bg-background p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID Transaksi</span>
                  <span className="font-mono font-medium">{submittedTx?.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nominal</span>
                  <span className="font-bold">{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-yellow-500 gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Batas Waktu</span>
                  <span className="font-medium text-yellow-700">{expiryTime}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/customer/history">Lihat Riwayat</Link>
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  Top-Up Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Pembayaran Berhasil!
                </h2>
                <p className="text-green-700 dark:text-green-300 mt-1">
                  Saldo RFID Anda telah bertambah.
                </p>
              </div>

              <div className="bg-white dark:bg-background p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID Transaksi</span>
                  <span className="font-mono font-medium">{submittedTx?.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nominal</span>
                  <span className="font-bold">{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-500 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Success
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/customer/history">Lihat Riwayat</Link>
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  Top-Up Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
