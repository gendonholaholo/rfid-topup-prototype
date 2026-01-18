'use client';

import { useState } from 'react';
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
  CreditCard,
  CheckCircle2,
  XCircle,
  Zap,
  Play,
  RefreshCw,
} from 'lucide-react';
import { useIntegrationStore } from '@/store/useIntegrationStore';
import { formatCurrency, formatDate } from '@/data/mock-data';
import {
  PageHeader,
  InfoBanner,
  FlowDiagram,
  PLAN_A_FLOW,
  StarRating,
} from '@/components/integration';
import { TransactionStatusBadge } from '@/components/ui/status-badge';
import { PaymentGatewayVendor, PlanATransaction } from '@/types/integrations';

export default function PlanAPage(): React.ReactElement {
  const { planAVendors, selectedVendor, selectVendor, planATransactions } = useIntegrationStore();
  const [isSimulating, setIsSimulating] = useState(false);

  async function handleSimulatePayment(): Promise<void> {
    setIsSimulating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSimulating(false);
  }

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <PageHeader
          title="Plan A: Payment Gateway"
          subtitle="Integrasi dengan payment gateway untuk pembayaran real-time"
          icon={CreditCard}
          iconColor="text-blue-600"
        />

        <InfoBanner
          title="Fully Automated Payment"
          description="Dengan payment gateway, pelanggan dapat top-up dan saldo akan bertambah secara <strong>instant</strong> tanpa perlu verifikasi manual. Gateway akan mengirim callback otomatis ke sistem saat pembayaran berhasil."
          icon={Zap}
          variant="blue"
        />

        <Tabs defaultValue="comparison">
          <TabsList>
            <TabsTrigger value="comparison">Perbandingan Vendor</TabsTrigger>
            <TabsTrigger value="simulation">Simulasi</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <VendorComparisonTable
              vendors={planAVendors}
              selectedVendor={selectedVendor}
              onSelectVendor={selectVendor}
            />
            <VendorDetailCards
              vendors={planAVendors}
              selectedVendorId={selectedVendor?.id}
            />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            <SimulationCard
              isSimulating={isSimulating}
              onSimulate={handleSimulatePayment}
            />
            <FlowDiagram
              title="Alur Pembayaran Plan A"
              steps={PLAN_A_FLOW}
              timing="Total waktu: < 1 menit (real-time)"
              useZapIcon
            />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTable transactions={planATransactions} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

interface VendorComparisonTableProps {
  vendors: PaymentGatewayVendor[];
  selectedVendor: PaymentGatewayVendor | null;
  onSelectVendor: (vendor: PaymentGatewayVendor) => void;
}

function VendorComparisonTable({
  vendors,
  selectedVendor,
  onSelectVendor,
}: VendorComparisonTableProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbandingan Payment Gateway</CardTitle>
        <CardDescription>
          Bandingkan fitur dan harga dari berbagai vendor payment gateway
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Vendor</TableHead>
                <TableHead>Setup Fee</TableHead>
                <TableHead>VA Fee</TableHead>
                <TableHead>Settlement</TableHead>
                <TableHead className="text-center">Bank Support</TableHead>
                <TableHead className="text-center">API Quality</TableHead>
                <TableHead className="text-center">Dashboard</TableHead>
                <TableHead>Support</TableHead>
                <TableHead className="text-center">Callback</TableHead>
                <TableHead className="text-center">Refund</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => {
                const isSelected = selectedVendor?.id === vendor.id;
                return (
                  <TableRow
                    key={vendor.id}
                    className={isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vendor.name}</span>
                        {vendor.isRecommended && (
                          <Badge className="bg-green-500 text-xs">Recommended</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{vendor.features.setupFee}</TableCell>
                    <TableCell>{vendor.features.vaFee}</TableCell>
                    <TableCell>{vendor.features.settlementTime}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{vendor.features.bankSupport} bank</Badge>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={vendor.features.apiQuality} />
                    </TableCell>
                    <TableCell>
                      <StarRating rating={vendor.features.dashboardQuality} />
                    </TableCell>
                    <TableCell className="text-sm">{vendor.features.supportHours}</TableCell>
                    <TableCell className="text-center">
                      <FeatureIcon enabled={vendor.features.hasCallback} />
                    </TableCell>
                    <TableCell className="text-center">
                      <FeatureIcon enabled={vendor.features.hasRefund} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => onSelectVendor(vendor)}
                      >
                        {isSelected ? 'Terpilih' : 'Pilih'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureIconProps {
  enabled: boolean;
}

function FeatureIcon({ enabled }: FeatureIconProps): React.ReactElement {
  if (enabled) {
    return <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />;
  }
  return <XCircle className="h-5 w-5 text-red-500 mx-auto" />;
}

interface VendorDetailCardsProps {
  vendors: PaymentGatewayVendor[];
  selectedVendorId?: string;
}

function VendorDetailCards({ vendors, selectedVendorId }: VendorDetailCardsProps): React.ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {vendors.map((vendor) => {
        const isSelected = selectedVendorId === vendor.id;
        return (
          <Card key={vendor.id} className={isSelected ? 'ring-2 ring-blue-500' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {vendor.name}
                  {vendor.isRecommended && (
                    <Badge className="bg-green-500">Recommended</Badge>
                  )}
                </CardTitle>
              </div>
              <CardDescription>{vendor.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ProsConsList title="Kelebihan" items={vendor.pros} type="pros" />
                <ProsConsList title="Kekurangan" items={vendor.cons} type="cons" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface ProsConsListProps {
  title: string;
  items: string[];
  type: 'pros' | 'cons';
}

function ProsConsList({ title, items, type }: ProsConsListProps): React.ReactElement {
  const titleColor = type === 'pros' ? 'text-green-600' : 'text-orange-600';
  const Icon = type === 'pros' ? CheckCircle2 : XCircle;
  const iconColor = type === 'pros' ? 'text-green-500' : 'text-orange-500';

  return (
    <div>
      <p className={`text-xs font-medium ${titleColor} mb-2`}>{title}</p>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SimulationCardProps {
  isSimulating: boolean;
  onSimulate: () => void;
}

function SimulationCard({ isSimulating, onSimulate }: SimulationCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulasi Payment Gateway</CardTitle>
        <CardDescription>
          Demo alur pembayaran menggunakan payment gateway (simulasi)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <CustomerSimulationPanel
            isSimulating={isSimulating}
            onSimulate={onSimulate}
          />
          <SystemCallbackPanel isSimulating={isSimulating} />
        </div>
      </CardContent>
    </Card>
  );
}

interface CustomerSimulationPanelProps {
  isSimulating: boolean;
  onSimulate: () => void;
}

function CustomerSimulationPanel({
  isSimulating,
  onSimulate,
}: CustomerSimulationPanelProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-bold text-blue-600">1</span>
        </div>
        Sisi Customer
      </h3>
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4 space-y-4">
          <SimulationField label="Virtual Account" value="8810012345678901" />
          <SimulationField label="Nominal Top-Up" value="Rp 10.000.000" />
          <SimulationField label="Bank Tujuan" value="BCA Virtual Account" />
          <Button onClick={onSimulate} disabled={isSimulating} className="w-full">
            {isSimulating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Memproses Pembayaran...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Simulasi Bayar
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface SimulationFieldProps {
  label: string;
  value: string;
}

function SimulationField({ label, value }: SimulationFieldProps): React.ReactElement {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1 p-3 bg-white rounded-md border font-mono">{value}</div>
    </div>
  );
}

interface SystemCallbackPanelProps {
  isSimulating: boolean;
}

function SystemCallbackPanel({ isSimulating }: SystemCallbackPanelProps): React.ReactElement {
  const callbackPayload = `{
  "id": "va_12345",
  "external_id": "XND-VA-001",
  "bank_code": "BCA",
  "merchant_code": "88100",
  "name": "PT Logistik Nusantara",
  "account_number": "8810012345678901",
  "expected_amount": 10000000,
  "status": "PAID",
  "paid_at": "2026-01-02T09:15:00Z"
}`;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-sm font-bold text-green-600">2</span>
        </div>
        Sisi Sistem (Callback)
      </h3>
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Callback URL</label>
            <div className="mt-1 p-3 bg-white rounded-md border text-sm font-mono break-all">
              https://impazz.pertamina.com/api/callback/xendit
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="mt-1">
              {isSimulating ? (
                <Badge className="bg-yellow-500 gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Menunggu Callback...
                </Badge>
              ) : (
                <Badge className="bg-green-500">Ready</Badge>
              )}
            </div>
          </div>
          <div className="p-3 bg-gray-900 rounded-md text-green-400 font-mono text-xs overflow-x-auto">
            <pre>{callbackPayload}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TransactionsTableProps {
  transactions: PlanATransaction[];
}

function TransactionsTable({ transactions }: TransactionsTableProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi Plan A</CardTitle>
        <CardDescription>Transaksi yang masuk via payment gateway</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>VA</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((trx) => (
              <TableRow key={trx.id}>
                <TableCell className="font-mono text-sm">{trx.externalId}</TableCell>
                <TableCell>{trx.customerName}</TableCell>
                <TableCell className="font-mono text-sm">{trx.virtualAccountNumber}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(trx.amount)}
                </TableCell>
                <TableCell>
                  <TransactionStatusBadge status={trx.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(trx.paidAt || trx.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
