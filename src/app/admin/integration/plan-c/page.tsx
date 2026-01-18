'use client';

import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  Eye,
  Trash2,
} from 'lucide-react';
import { useIntegrationStore } from '@/store/useIntegrationStore';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/data/mock-data';
import { fileImportTemplates } from '@/data/mock-integrations';
import { BankStatement, FileImportTemplate } from '@/types';
import {
  PageHeader,
  InfoBanner,
  FlowDiagram,
  PLAN_C_FLOW,
} from '@/components/integration';
import { ImportStatusBadge } from '@/components/ui/status-badge';

interface ParsedRow {
  virtualAccount: string;
  amount: number;
  date: string;
  senderName: string;
  reference: string;
  isValid: boolean;
  error?: string;
}

// Mock parsed data for demo
const MOCK_PARSED_DATA: ParsedRow[] = [
  {
    virtualAccount: '8810012345678901',
    amount: 10000000,
    date: '2026-01-02',
    senderName: 'PT ABC Indonesia',
    reference: 'TRF-001',
    isValid: true,
  },
  {
    virtualAccount: '8810012345678902',
    amount: 5000000,
    date: '2026-01-02',
    senderName: 'PT XYZ Corp',
    reference: 'TRF-002',
    isValid: true,
  },
  {
    virtualAccount: '8810012345678903',
    amount: 8500000,
    date: '2026-01-02',
    senderName: 'CV Mitra Ekspedisi',
    reference: 'TRF-003',
    isValid: true,
  },
  {
    virtualAccount: 'INVALID-VA',
    amount: 0,
    date: '2026-01-02',
    senderName: 'Unknown',
    reference: 'TRF-004',
    isValid: false,
    error: 'Invalid VA format',
  },
];

export default function PlanCPage(): React.ReactElement {
  const { importSessions, addImportSession } = useIntegrationStore();
  const addBankStatements = useStore((state) => state.addBankStatements);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<FileImportTemplate>(fileImportTemplates[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  function handleDownloadTemplate(): void {
    const blob = new Blob([selectedTemplate.sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `template_${selectedTemplate.bankCode.toLowerCase()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setParsedData(MOCK_PARSED_DATA);
    setShowPreview(true);
    setIsUploading(false);
  }

  async function handleImport(): Promise<void> {
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const validRows = parsedData.filter((row) => row.isValid);

    const statements: Omit<BankStatement, 'id' | 'createdAt' | 'updatedAt' | 'status'>[] =
      validRows.map((row) => ({
        source: 'file_import' as const,
        bankCode: selectedTemplate.bankCode,
        accountNumber: '1234567890',
        virtualAccountNumber: row.virtualAccount,
        amount: row.amount,
        transactionDate: new Date(row.date).toISOString(),
        senderName: row.senderName,
        reference: row.reference,
      }));

    addBankStatements(statements);

    addImportSession({
      id: `IMP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      fileName: `rekening_koran_${selectedTemplate.bankCode.toLowerCase()}.csv`,
      fileSize: 15360,
      bankCode: selectedTemplate.bankCode,
      totalRows: parsedData.length,
      successRows: validRows.length,
      failedRows: parsedData.length - validRows.length,
      status: 'completed',
      errors: parsedData
        .filter((row) => !row.isValid)
        .map((row, idx) => ({ row: idx + 1, message: row.error || 'Unknown error' })),
      importedAt: new Date().toISOString(),
      importedBy: 'Admin',
    });

    resetPreview();
    setIsUploading(false);
  }

  function resetPreview(): void {
    setParsedData([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const validRowCount = parsedData.filter((r) => r.isValid).length;

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <PageHeader
          title="Plan C: File Import"
          subtitle="Import rekening koran dari file CSV/Excel"
          icon={FileSpreadsheet}
          iconColor="text-green-600"
        />

        <InfoBanner
          title="Manual Import dengan Auto-Matching"
          description="Export rekening koran dari internet banking, upload ke sistem, dan biarkan Matching Engine mencocokkan dengan data Webreport. Admin hanya perlu <strong>upload file + 1-click verify</strong>."
          icon={Upload}
          variant="green"
        />

        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Riwayat Import</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {showPreview ? (
              <PreviewCard
                parsedData={parsedData}
                validRowCount={validRowCount}
                isUploading={isUploading}
                onImport={handleImport}
                onCancel={resetPreview}
              />
            ) : (
              <UploadCard
                templates={fileImportTemplates}
                selectedTemplate={selectedTemplate}
                isUploading={isUploading}
                fileInputRef={fileInputRef}
                onTemplateSelect={setSelectedTemplate}
                onDownloadTemplate={handleDownloadTemplate}
                onFileUpload={handleFileUpload}
              />
            )}
            <FlowDiagram
              title="Alur Pembayaran Plan C"
              steps={PLAN_C_FLOW}
              timing="Total waktu: Tergantung jadwal import (rekomendasi: 2-3x sehari)"
            />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesCard
              templates={fileImportTemplates}
              onDownload={(template) => {
                setSelectedTemplate(template);
                handleDownloadTemplate();
              }}
            />
          </TabsContent>

          <TabsContent value="history">
            <ImportHistoryCard sessions={importSessions} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

interface UploadCardProps {
  templates: FileImportTemplate[];
  selectedTemplate: FileImportTemplate;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTemplateSelect: (template: FileImportTemplate) => void;
  onDownloadTemplate: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadCard({
  templates,
  selectedTemplate,
  isUploading,
  fileInputRef,
  onTemplateSelect,
  onDownloadTemplate,
  onFileUpload,
}: UploadCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Rekening Koran</CardTitle>
        <CardDescription>Pilih template bank lalu upload file rekening koran</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BankTemplateSelector
          templates={templates}
          selectedId={selectedTemplate.id}
          onSelect={onTemplateSelect}
        />

        <TemplateDownloadSection
          template={selectedTemplate}
          onDownload={onDownloadTemplate}
        />

        <FileDropzone
          isUploading={isUploading}
          fileInputRef={fileInputRef}
          onFileUpload={onFileUpload}
        />
      </CardContent>
    </Card>
  );
}

interface BankTemplateSelectorProps {
  templates: FileImportTemplate[];
  selectedId: string;
  onSelect: (template: FileImportTemplate) => void;
}

function BankTemplateSelector({
  templates,
  selectedId,
  onSelect,
}: BankTemplateSelectorProps): React.ReactElement {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Pilih Bank</label>
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => {
          const isSelected = selectedId === template.id;
          const buttonClass = isSelected
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
            : 'hover:border-gray-400';

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`p-4 border rounded-lg text-left transition-all ${buttonClass}`}
            >
              <p className="font-medium">{template.bankName}</p>
              <p className="text-sm text-muted-foreground">
                Format: {template.format.toUpperCase()}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TemplateDownloadSectionProps {
  template: FileImportTemplate;
  onDownload: () => void;
}

function TemplateDownloadSection({ template, onDownload }: TemplateDownloadSectionProps): React.ReactElement {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <FileText className="h-8 w-8 text-muted-foreground" />
      <div className="flex-1">
        <p className="font-medium">Download Template</p>
        <p className="text-sm text-muted-foreground">
          Unduh template {template.format.toUpperCase()} untuk {template.bankName}
        </p>
      </div>
      <Button variant="outline" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    </div>
  );
}

interface FileDropzoneProps {
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileDropzone({ isUploading, fileInputRef, onFileUpload }: FileDropzoneProps): React.ReactElement {
  const UploadIcon = isUploading ? RefreshCw : Upload;
  const iconClass = isUploading ? 'animate-spin' : '';

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={onFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <UploadIcon className={`h-12 w-12 mx-auto mb-4 text-muted-foreground ${iconClass}`} />
        <p className="font-medium mb-2">
          {isUploading ? 'Memproses file...' : 'Klik untuk upload atau drag & drop'}
        </p>
        <p className="text-sm text-muted-foreground">
          Mendukung CSV, XLSX, XLS (max 5MB)
        </p>
      </label>
    </div>
  );
}

interface PreviewCardProps {
  parsedData: ParsedRow[];
  validRowCount: number;
  isUploading: boolean;
  onImport: () => void;
  onCancel: () => void;
}

function PreviewCard({
  parsedData,
  validRowCount,
  isUploading,
  onImport,
  onCancel,
}: PreviewCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview Data
            </CardTitle>
            <CardDescription>
              {validRowCount} dari {parsedData.length} baris valid
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              <Trash2 className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button onClick={onImport} disabled={isUploading}>
              {isUploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Import {validRowCount} Baris
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ParsedDataTable data={parsedData} />
      </CardContent>
    </Card>
  );
}

interface ParsedDataTableProps {
  data: ParsedRow[];
}

function ParsedDataTable({ data }: ParsedDataTableProps): React.ReactElement {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Virtual Account</TableHead>
          <TableHead className="text-right">Nominal</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Pengirim</TableHead>
          <TableHead>Referensi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow
            key={idx}
            className={!row.isValid ? 'bg-red-50 dark:bg-red-950/20' : ''}
          >
            <TableCell>
              <RowValidationStatus row={row} />
            </TableCell>
            <TableCell className="font-mono text-sm">{row.virtualAccount}</TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(row.amount)}
            </TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.senderName}</TableCell>
            <TableCell>{row.reference}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface RowValidationStatusProps {
  row: ParsedRow;
}

function RowValidationStatus({ row }: RowValidationStatusProps): React.ReactElement {
  if (row.isValid) {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  }
  return (
    <div className="flex items-center gap-2">
      <XCircle className="h-5 w-5 text-red-500" />
      <span className="text-xs text-red-600">{row.error}</span>
    </div>
  );
}

interface TemplatesCardProps {
  templates: FileImportTemplate[];
  onDownload: (template: FileImportTemplate) => void;
}

function TemplatesCard({ templates, onDownload }: TemplatesCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Format Template per Bank</CardTitle>
        <CardDescription>Setiap bank memiliki format rekening koran yang berbeda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {templates.map((template) => (
          <TemplateDetail key={template.id} template={template} onDownload={() => onDownload(template)} />
        ))}
      </CardContent>
    </Card>
  );
}

interface TemplateDetailProps {
  template: FileImportTemplate;
  onDownload: () => void;
}

function TemplateDetail({ template, onDownload }: TemplateDetailProps): React.ReactElement {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold">{template.bankName}</h4>
          <p className="text-sm text-muted-foreground">
            Format: {template.format.toUpperCase()} | Date Format: {template.dateFormat}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>
      <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono whitespace-pre">
          {template.sampleData}
        </pre>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">VA: {template.columns.virtualAccount}</Badge>
        <Badge variant="outline">Amount: {template.columns.amount}</Badge>
        <Badge variant="outline">Date: {template.columns.date}</Badge>
        {template.delimiter && (
          <Badge variant="outline">
            Delimiter: {template.delimiter === ';' ? 'Semicolon (;)' : 'Comma (,)'}
          </Badge>
        )}
      </div>
    </div>
  );
}

interface ImportHistoryCardProps {
  sessions: typeof import('@/data/mock-integrations').mockImportSessions;
}

function ImportHistoryCard({ sessions }: ImportHistoryCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Import</CardTitle>
        <CardDescription>Log file yang sudah di-import ke sistem</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <EmptyHistoryState />
        ) : (
          <ImportHistoryTable sessions={sessions} />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyHistoryState(): React.ReactElement {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p>Belum ada file yang di-import</p>
    </div>
  );
}

interface ImportHistoryTableProps {
  sessions: typeof import('@/data/mock-integrations').mockImportSessions;
}

function ImportHistoryTable({ sessions }: ImportHistoryTableProps): React.ReactElement {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File</TableHead>
          <TableHead>Bank</TableHead>
          <TableHead className="text-center">Total Rows</TableHead>
          <TableHead className="text-center">Success</TableHead>
          <TableHead className="text-center">Failed</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Waktu</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium">{session.fileName}</TableCell>
            <TableCell>{session.bankCode}</TableCell>
            <TableCell className="text-center">{session.totalRows}</TableCell>
            <TableCell className="text-center text-green-600">{session.successRows}</TableCell>
            <TableCell className="text-center text-red-600">{session.failedRows}</TableCell>
            <TableCell>
              <ImportStatusBadge status={session.status} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(session.importedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
