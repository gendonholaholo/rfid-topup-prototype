'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate, bankCodes } from '@/data/mock-data';
import { parseCSV, CSV_TEMPLATE, CSV_TEMPLATE_HEADERS } from '@/lib/engine/file-parser';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Building2,
  Send,
  Wifi,
  Radio,
  ArrowRight,
  Zap,
  Clock,
} from 'lucide-react';


// Types
interface ParsedPreview {
  virtualAccountNumber: string;
  amount: number;
  transactionDate: string;
  senderName?: string;
  reference?: string;
}

interface WebhookLog {
  id: string;
  timestamp: Date;
  type: 'received' | 'stored' | 'ready';
  message: string;
  data?: { va: string; amount: number };
}

// Flow Diagram Component
function FlowDiagram({ scenario }: { scenario: 'webhook' | 'file' }) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center gap-2 text-sm">
        {scenario === 'webhook' ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Bank</span>
            </div>
            <ArrowRight className="h-4 w-4 text-green-500" />
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded text-green-700 dark:text-green-300">
              <Zap className="h-3 w-3" />
              <span className="text-xs font-medium">Webhook (Real-time)</span>
            </div>
            <ArrowRight className="h-4 w-4 text-green-500" />
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Radio className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-700 dark:text-red-300">IMPAZZ</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <div className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
              <span className="font-medium">Matching Engine</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-700 dark:text-blue-300">Internet Banking</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded text-yellow-700 dark:text-yellow-300">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-medium">Export Manual (CSV)</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Upload className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-700 dark:text-red-300">IMPAZZ Import</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <div className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
              <span className="font-medium">Matching Engine</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


function IntegrationDemoContent() {
  const bankStatements = useStore((state) => state.bankStatements);
  const addBankStatement = useStore((state) => state.addBankStatement);
  const addBankStatements = useStore((state) => state.addBankStatements);

  // Tab state from URL params
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'file' ? 'file' : 'webhook';
  const [activeTab, setActiveTab] = useState<'webhook' | 'file'>(initialTab);

  // Webhook states
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [isSimulating, setIsSimulating] = useState(false);
  const [vaNumber, setVaNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [senderName, setSenderName] = useState('');
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);

  // File import states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ParsedPreview[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  // Filter statements by source
  const apiStatements = bankStatements.filter((s) => s.source === 'api');
  const fileStatements = bankStatements.filter((s) => s.source === 'file_import');


  // Add log entry helper
  const addLog = (type: WebhookLog['type'], message: string, data?: { va: string; amount: number }) => {
    setWebhookLogs(prev => [{
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      type,
      message,
      data,
    }, ...prev].slice(0, 20)); // Keep last 20 logs
  };

  // Webhook simulation handler
  const handleSimulateWebhook = async () => {
    if (!vaNumber || !amount) return;

    setIsSimulating(true);
    const numAmount = Number(amount);
    
    // Step 1: Webhook received
    addLog('received', `Webhook received from ${selectedBank}`, { va: vaNumber, amount: numAmount });
    await new Promise(r => setTimeout(r, 500));
    
    // Step 2: Data stored
    addLog('stored', 'Transaction data stored to database');
    await new Promise(r => setTimeout(r, 500));
    
    // Step 3: Add to store
    addBankStatement({
      source: 'api',
      bankCode: selectedBank,
      accountNumber: '1234567890',
      virtualAccountNumber: vaNumber,
      amount: numAmount,
      transactionDate: new Date().toISOString(),
      senderName: senderName || undefined,
      reference: `WH-${Date.now()}`,
    });
    
    // Step 3: Ready for matching
    addLog('ready', 'Ready for matching engine');

    setVaNumber('');
    setAmount('');
    setSenderName('');
    setIsSimulating(false);
  };


  // File import handlers
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
    } catch {
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearPreview = () => {
    setPreviewData([]);
    setParseErrors([]);
    setParseWarnings([]);
    setFileName('');
    setImportSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'matched': return <Badge className="bg-blue-500">Matched</Badge>;
      case 'processed': return <Badge className="bg-green-500">Processed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Demo Integrasi Bank</h1>
          <p className="text-muted-foreground">
            Pilih skenario integrasi untuk menerima data rekening koran
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'webhook' | 'file')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webhook" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Skenario A: Webhook (Real-time)
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Skenario B: File Import (Batch)
            </TabsTrigger>
          </TabsList>


          {/* WEBHOOK TAB */}
          <TabsContent value="webhook" className="space-y-4">
            <FlowDiagram scenario="webhook" />
            
            {/* Info Banner */}
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="py-3">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Skenario Partnership Bank:</strong> Bank mengirim notifikasi pembayaran 
                  secara real-time ke endpoint IMPAZZ. Membutuhkan kerjasama teknis dengan bank.
                </p>
              </CardContent>
            </Card>

            {/* Split Screen */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* LEFT: Bank Side */}
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Building2 className="h-5 w-5" />
                    Sisi Bank (Eksternal)
                  </CardTitle>
                  <CardDescription>Simulasi sistem bank mengirim webhook</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-xs">
                    <p className="text-muted-foreground mb-1">Webhook Endpoint:</p>
                    <p className="text-blue-600">POST /api/webhook/bank</p>
                  </div>

                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Bank</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          {bankCodes.map((bank) => (
                            <option key={bank.code} value={bank.code}>{bank.code}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Virtual Account</label>
                        <Input
                          placeholder="8810012345678901"
                          value={vaNumber}
                          onChange={(e) => setVaNumber(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Nominal</label>
                        <Input
                          type="number"
                          placeholder="10000000"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Pengirim</label>
                        <Input
                          placeholder="PT ABC"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>


                  {/* Payload Preview */}
                  {(vaNumber || amount) && (
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Payload JSON:</p>
                      <pre className="text-xs text-green-400 overflow-x-auto">
{JSON.stringify({
  bank_code: selectedBank,
  virtual_account: vaNumber || '...',
  amount: Number(amount) || 0,
  sender_name: senderName || undefined,
  timestamp: new Date().toISOString(),
}, null, 2)}
                      </pre>
                    </div>
                  )}

                  <Button
                    onClick={handleSimulateWebhook}
                    disabled={!vaNumber || !amount || isSimulating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSimulating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSimulating ? 'Mengirim...' : 'Push ke IMPAZZ'}
                  </Button>
                </CardContent>
              </Card>

              {/* RIGHT: IMPAZZ Side */}
              <Card className="border-red-200">
                <CardHeader className="bg-red-50 dark:bg-red-950/30 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <Radio className="h-5 w-5" />
                    Sisi IMPAZZ (Internal)
                  </CardTitle>
                  <CardDescription>Live activity feed webhook masuk</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {webhookLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Wifi className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Menunggu webhook...</p>
                      </div>
                    ) : (
                      webhookLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-800">
                          <div className={`mt-1 h-2 w-2 rounded-full ${
                            log.type === 'received' ? 'bg-blue-500' :
                            log.type === 'stored' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {log.timestamp.toLocaleTimeString('id-ID')}
                              </span>
                              <span className="font-medium">{log.message}</span>
                            </div>
                            {log.data && (
                              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                VA: {log.data.va} | {formatCurrency(log.data.amount)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Webhook Data Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data dari Webhook</CardTitle>
              </CardHeader>
              <CardContent>
                {apiStatements.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-sm">Belum ada data</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Virtual Account</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiStatements.slice(0, 10).map((stmt) => (
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
          </TabsContent>


          {/* FILE IMPORT TAB */}
          <TabsContent value="file" className="space-y-4">
            <FlowDiagram scenario="file" />
            
            {/* Info Banner */}
            <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardContent className="py-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Skenario Export Manual:</strong> Admin mengexport rekening koran dari 
                  internet banking dalam format CSV, lalu upload ke IMPAZZ. Cocok untuk tahap awal implementasi.
                </p>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload File CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="h-10 px-3 rounded-md border border-input bg-background"
                  >
                    {bankCodes.map((bank) => (
                      <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                  </select>
                  <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>

                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="font-medium">{fileName || 'Klik untuk upload CSV'}</p>
                  </label>
                </div>

                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Format kolom:</p>
                  <p className="text-muted-foreground">{CSV_TEMPLATE_HEADERS.join(' | ')}</p>
                </div>
              </CardContent>
            </Card>


            {/* Processing */}
            {isProcessing && (
              <Card>
                <CardContent className="py-6 text-center">
                  <RefreshCw className="h-6 w-6 mx-auto animate-spin text-primary mb-2" />
                  <p className="text-sm">Memproses file...</p>
                </CardContent>
              </Card>
            )}

            {/* Errors */}
            {parseErrors.length > 0 && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <CardContent className="py-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-700">Error:</p>
                      {parseErrors.map((err, i) => <p key={i} className="text-red-600">• {err}</p>)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {parseWarnings.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="py-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-700">Peringatan:</p>
                      {parseWarnings.slice(0, 3).map((w, i) => <p key={i} className="text-yellow-600">• {w}</p>)}
                      {parseWarnings.length > 3 && <p className="text-yellow-600">• ...{parseWarnings.length - 3} lainnya</p>}
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
                      <CardTitle className="text-base">Preview Data</CardTitle>
                      <CardDescription>{previewData.length} baris siap diimport</CardDescription>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-sm">{row.virtualAccountNumber}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.amount)}</TableCell>
                          <TableCell>{new Date(row.transactionDate).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>{row.senderName || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {previewData.length > 5 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      +{previewData.length - 5} baris lainnya
                    </p>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleClearPreview}>Batal</Button>
                    <Button onClick={handleImport}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Import {previewData.length} Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success */}
            {importSuccess && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium text-green-700">
                      Berhasil import {importedCount} data transaksi
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}


            {/* File Data Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Riwayat Import</CardTitle>
              </CardHeader>
              <CardContent>
                {fileStatements.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-sm">Belum ada data diimport</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Virtual Account</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fileStatements.slice(0, 10).map((stmt) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default function IntegrationDemoPage() {
  return (
    <Suspense fallback={<MainLayout userType="admin"><div className="p-6">Loading...</div></MainLayout>}>
      <IntegrationDemoContent />
    </Suspense>
  );
}
