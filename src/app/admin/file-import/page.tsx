'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate, bankCodes } from '@/data/mock-data';
import { parseCSV, CSV_TEMPLATE, CSV_TEMPLATE_HEADERS } from '@/lib/engine/file-parser';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  X,
  AlertTriangle,
} from 'lucide-react';

interface ParsedPreview {
  virtualAccountNumber: string;
  amount: number;
  transactionDate: string;
  senderName?: string;
  reference?: string;
}

export default function FileImportPage() {
  const bankStatements = useStore((state) => state.bankStatements);
  const addBankStatements = useStore((state) => state.addBankStatements);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ParsedPreview[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  // Filter file import statements
  const fileStatements = bankStatements.filter((s) => s.source === 'file_import');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setImportSuccess(false);
    setParseErrors([]);
    setParseWarnings([]);

    try {
      const content = await file.text();
      const result = parseCSV(content);

      setPreviewData(result.data);
      setParseErrors(result.errors);
      setParseWarnings(result.warnings);
    } catch (error) {
      setParseErrors(['Gagal membaca file. Pastikan format file benar.']);
    }

    setIsProcessing(false);
  };

  const handleImport = () => {
    if (previewData.length === 0) return;

    const statements = previewData.map((row) => ({
      source: 'file_import' as const,
      bankCode: selectedBank,
      accountNumber: '1234567890',
      virtualAccountNumber: row.virtualAccountNumber,
      amount: row.amount,
      transactionDate: row.transactionDate,
      senderName: row.senderName,
      reference: row.reference,
    }));

    addBankStatements(statements);
    setImportedCount(statements.length);
    setImportSuccess(true);
    setPreviewData([]);
    setFileName('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearPreview = () => {
    setPreviewData([]);
    setParseErrors([]);
    setParseWarnings([]);
    setFileName('');
    setImportSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_rekening_koran.csv';
    a.click();
    URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold">Import File Rekening Koran</h1>
          <p className="text-muted-foreground">
            Import data transaksi dari file CSV rekening koran bank
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload File
            </CardTitle>
            <CardDescription>
              Upload file CSV dari rekening koran bank
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background"
              >
                {bankCodes.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template CSV
              </Button>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">
                  {fileName || 'Klik untuk upload file CSV'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  atau drag and drop file ke sini
                </p>
              </label>
            </div>

            {/* Template Info */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium text-sm mb-2">Format kolom CSV:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {CSV_TEMPLATE_HEADERS.map((header, i) => (
                  <li key={i}>• {header}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Processing Indicator */}
        {isProcessing && (
          <Card>
            <CardContent className="py-8 text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary mb-3" />
              <p>Memproses file...</p>
            </CardContent>
          </Card>
        )}

        {/* Parse Errors */}
        {parseErrors.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">
                    Error parsing file
                  </p>
                  <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
                    {parseErrors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parse Warnings */}
        {parseWarnings.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700 dark:text-yellow-300">
                    Peringatan
                  </p>
                  <ul className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 space-y-1">
                    {parseWarnings.slice(0, 5).map((warn, i) => (
                      <li key={i}>• {warn}</li>
                    ))}
                    {parseWarnings.length > 5 && (
                      <li>• ...dan {parseWarnings.length - 5} peringatan lainnya</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Data */}
        {previewData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview Data</CardTitle>
                  <CardDescription>
                    {previewData.length} baris data siap diimport
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClearPreview}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Virtual Account</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pengirim</TableHead>
                    <TableHead>Referensi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{row.virtualAccountNumber}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.amount)}</TableCell>
                      <TableCell>{new Date(row.transactionDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{row.senderName || '-'}</TableCell>
                      <TableCell>{row.reference || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {previewData.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Menampilkan 10 dari {previewData.length} baris
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={handleClearPreview}>
                  Batal
                </Button>
                <Button onClick={handleImport}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Import {previewData.length} Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Success */}
        {importSuccess && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="font-medium text-green-700 dark:text-green-300">
                  Berhasil import {importedCount} data transaksi
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Imported Data History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Import</CardTitle>
            <CardDescription>
              Data yang sudah diimport dari file
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fileStatements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada data yang diimport</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu Import</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Virtual Account</TableHead>
                    <TableHead className="text-right">Nominal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileStatements.slice(0, 20).map((stmt) => (
                    <TableRow key={stmt.id}>
                      <TableCell className="text-sm">{formatDate(stmt.createdAt)}</TableCell>
                      <TableCell><Badge variant="outline">{stmt.bankCode}</Badge></TableCell>
                      <TableCell className="font-mono text-sm">{stmt.virtualAccountNumber}</TableCell>
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
