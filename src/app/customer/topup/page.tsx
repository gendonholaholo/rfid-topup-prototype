'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency, bankCodes } from '@/data/mock-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock,
  Upload,
  Building2,
  Calendar,
  FileText,
} from 'lucide-react';

type Step = 'form' | 'confirm' | 'success';

export default function TopUpPage() {
  const customer = useStore((state) => state.customer);
  const addWebreportSubmission = useStore((state) => state.addWebreportSubmission);

  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [bankSender, setBankSender] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const quickAmounts = [1000000, 2000000, 5000000, 10000000];

  const handleSubmit = () => {
    if (!amount || !bankSender || !transferDate) return;
    setStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const submission = addWebreportSubmission({
      customerId: customer.id,
      customerName: customer.companyName,
      virtualAccountNumber: customer.virtualAccountNumber,
      amount: Number(amount),
      transferDate: new Date(transferDate).toISOString(),
      bankSender,
      notes: notes || undefined,
    });

    setSubmissionId(submission.id);
    setIsSubmitting(false);
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    setAmount('');
    setBankSender('');
    setTransferDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setSubmissionId('');
  };

  return (
    <MainLayout userType="customer">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Lapor Top-Up Saldo</h1>
          <p className="text-muted-foreground">
            Laporkan transfer top-up saldo RFID Anda
          </p>
        </div>

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
                <Upload className="h-5 w-5" />
                Form Pelaporan Transfer
              </CardTitle>
              <CardDescription>
                Isi detail transfer yang sudah Anda lakukan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nominal Transfer</label>
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

              {/* Bank Sender */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank Pengirim
                </label>
                <select
                  value={bankSender}
                  onChange={(e) => setBankSender(e.target.value)}
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

              {/* Transfer Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Transfer
                </label>
                <Input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Catatan (Opsional)
                </label>
                <Input
                  placeholder="Contoh: Transfer untuk top-up bulan Januari"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!amount || !bankSender || !transferDate}
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
              <CardTitle>Konfirmasi Pelaporan</CardTitle>
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
                  <span className="text-muted-foreground">Bank Pengirim</span>
                  <span>{bankCodes.find((b) => b.code === bankSender)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Transfer</span>
                  <span>{new Date(transferDate).toLocaleDateString('id-ID')}</span>
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
                  {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
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
                  Laporan Berhasil Dikirim!
                </h2>
                <p className="text-green-700 dark:text-green-300 mt-1">
                  Laporan top-up Anda sedang diproses
                </p>
              </div>

              <div className="bg-white dark:bg-background p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID Laporan</span>
                  <span className="font-mono font-medium">{submissionId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nominal</span>
                  <span className="font-bold">{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Menunggu Verifikasi
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Saldo akan bertambah otomatis setelah sistem mencocokkan 
                laporan Anda dengan data rekening koran bank.
              </p>

              <Button onClick={handleReset} className="w-full">
                Buat Laporan Baru
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
