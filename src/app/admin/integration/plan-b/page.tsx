'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  Send,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { useIntegrationStore } from '@/store/useIntegrationStore';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/data/mock-data';
import { generateWebhookEvent } from '@/data/mock-integrations';
import {
  PageHeader,
  InfoBanner,
  FlowDiagram,
  PLAN_B_FLOW,
} from '@/components/integration';
import { WebhookStatusBadge } from '@/components/ui/status-badge';
import { getDifficultyColor } from '@/lib/utils/style-helpers';
import { BankPartner } from '@/types/integrations';

interface SimulationData {
  bankCode: string;
  virtualAccount: string;
  amount: string;
  senderName: string;
}

const DEFAULT_SIMULATION_DATA: SimulationData = {
  bankCode: 'BCA',
  virtualAccount: '8810012345678901',
  amount: '10000000',
  senderName: 'PT ABC Indonesia',
};

export default function PlanBPage(): React.ReactElement {
  const {
    bankPartners,
    connectedBanks,
    connectBank,
    disconnectBank,
    webhookEvents,
    addWebhookEvent,
    processWebhookEvent,
  } = useIntegrationStore();

  const addBankStatement = useStore((state) => state.addBankStatement);

  const [simulationData, setSimulationData] = useState<SimulationData>(DEFAULT_SIMULATION_DATA);
  const [isSending, setIsSending] = useState(false);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  function addLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setActivityLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  }

  function updateSimulationField<K extends keyof SimulationData>(
    field: K,
    value: SimulationData[K]
  ): void {
    setSimulationData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSimulateWebhook(): Promise<void> {
    setIsSending(true);
    addLog(`Mengirim webhook dari ${simulationData.bankCode}...`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const amount = parseInt(simulationData.amount, 10);
    const event = generateWebhookEvent(
      simulationData.bankCode,
      simulationData.virtualAccount,
      amount,
      simulationData.senderName
    );

    addWebhookEvent(event);
    addLog(`Webhook diterima: ${formatCurrency(amount)}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    addBankStatement({
      source: 'api',
      bankCode: simulationData.bankCode,
      accountNumber: '1234567890',
      virtualAccountNumber: simulationData.virtualAccount,
      amount,
      transactionDate: new Date().toISOString(),
      senderName: simulationData.senderName,
      reference: event.id,
    });

    processWebhookEvent(event.id);
    addLog(`Bank statement ditambahkan ke queue matching`);

    setIsSending(false);
  }

  const banksWithWebhookAPI = bankPartners.filter((b) => b.hasWebhookAPI);

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <PageHeader
          title="Plan B: Bank API Webhook"
          subtitle="Terima notifikasi otomatis dari bank via webhook"
          icon={Building2}
          iconColor="text-purple-600"
        />

        <InfoBanner
          title="Semi-Automated via Bank Webhook"
          description="Bank akan mengirim notifikasi (webhook) ke sistem setiap ada transaksi masuk ke Virtual Account. Data akan otomatis dicocokkan dengan laporan Webreport, admin hanya perlu <strong>1-click verify</strong>."
          icon={Wifi}
          variant="purple"
        />

        <Tabs defaultValue="banks">
          <TabsList>
            <TabsTrigger value="banks">Bank Partners</TabsTrigger>
            <TabsTrigger value="simulation">Simulasi Webhook</TabsTrigger>
            <TabsTrigger value="events">Webhook Events</TabsTrigger>
          </TabsList>

          <TabsContent value="banks" className="space-y-4">
            <BankPartnersCard
              banks={bankPartners}
              connectedBanks={connectedBanks}
              onConnect={connectBank}
              onDisconnect={disconnectBank}
            />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <WebhookSenderPanel
                simulationData={simulationData}
                banksWithWebhookAPI={banksWithWebhookAPI}
                isSending={isSending}
                onFieldChange={updateSimulationField}
                onSend={handleSimulateWebhook}
              />
              <ActivityLogPanel activityLog={activityLog} />
            </div>
            <FlowDiagram
              title="Alur Pembayaran Plan B"
              steps={PLAN_B_FLOW}
              timing="Total waktu: < 5 menit (setelah webhook diterima)"
            />
          </TabsContent>

          <TabsContent value="events">
            <WebhookEventsCard events={webhookEvents} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

interface BankPartnersCardProps {
  banks: BankPartner[];
  connectedBanks: string[];
  onConnect: (code: string) => void;
  onDisconnect: (code: string) => void;
}

function BankPartnersCard({
  banks,
  connectedBanks,
  onConnect,
  onDisconnect,
}: BankPartnersCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Partners</CardTitle>
        <CardDescription>
          Daftar bank yang dapat diintegrasikan via webhook API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank) => {
            const isConnected = connectedBanks.includes(bank.code);
            return (
              <BankPartnerCard
                key={bank.id}
                bank={bank}
                isConnected={isConnected}
                onToggleConnection={() =>
                  isConnected ? onDisconnect(bank.code) : onConnect(bank.code)
                }
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface BankPartnerCardProps {
  bank: BankPartner;
  isConnected: boolean;
  onToggleConnection: () => void;
}

function BankPartnerCard({
  bank,
  isConnected,
  onToggleConnection,
}: BankPartnerCardProps): React.ReactElement {
  const cardClass = isConnected
    ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20'
    : '';

  return (
    <Card className={cardClass}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">{bank.name}</h4>
            <p className="text-sm text-muted-foreground">{bank.code}</p>
          </div>
          <ConnectionBadge isConnected={isConnected} />
        </div>

        <div className="space-y-2 text-sm">
          <FeatureRow label="Webhook API" enabled={bank.hasWebhookAPI} />
          <FeatureRow label="Real-time" enabled={bank.webhookFeatures.realtime} />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Kesulitan</span>
            <Badge variant="outline" className={getDifficultyColor(bank.integrationDifficulty)}>
              {bank.integrationDifficulty}
            </Badge>
          </div>
        </div>

        <Button
          onClick={onToggleConnection}
          variant={isConnected ? 'outline' : 'default'}
          size="sm"
          className="w-full mt-4"
          disabled={!bank.hasWebhookAPI}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ConnectionBadgeProps {
  isConnected: boolean;
}

function ConnectionBadge({ isConnected }: ConnectionBadgeProps): React.ReactElement {
  if (isConnected) {
    return (
      <Badge className="bg-green-500 gap-1">
        <Wifi className="h-3 w-3" />
        Connected
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <WifiOff className="h-3 w-3" />
      Disconnected
    </Badge>
  );
}

interface FeatureRowProps {
  label: string;
  enabled: boolean;
}

function FeatureRow({ label, enabled }: FeatureRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {enabled ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );
}

interface WebhookSenderPanelProps {
  simulationData: SimulationData;
  banksWithWebhookAPI: BankPartner[];
  isSending: boolean;
  onFieldChange: <K extends keyof SimulationData>(field: K, value: SimulationData[K]) => void;
  onSend: () => void;
}

function WebhookSenderPanel({
  simulationData,
  banksWithWebhookAPI,
  isSending,
  onFieldChange,
  onSend,
}: WebhookSenderPanelProps): React.ReactElement {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          Sisi Bank (Pengirim)
        </CardTitle>
        <CardDescription>Simulasi bank mengirim webhook ke IMPAZZ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Bank</label>
          <select
            value={simulationData.bankCode}
            onChange={(e) => onFieldChange('bankCode', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            {banksWithWebhookAPI.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Virtual Account</label>
          <Input
            value={simulationData.virtualAccount}
            onChange={(e) => onFieldChange('virtualAccount', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Nominal</label>
          <Input
            type="number"
            value={simulationData.amount}
            onChange={(e) => onFieldChange('amount', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Nama Pengirim</label>
          <Input
            value={simulationData.senderName}
            onChange={(e) => onFieldChange('senderName', e.target.value)}
          />
        </div>
        <Button onClick={onSend} disabled={isSending} className="w-full">
          {isSending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Push Webhook ke IMPAZZ
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ActivityLogPanelProps {
  activityLog: string[];
}

function ActivityLogPanel({ activityLog }: ActivityLogPanelProps): React.ReactElement {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Activity className="h-4 w-4 text-green-600" />
          </div>
          Sisi IMPAZZ (Penerima)
        </CardTitle>
        <CardDescription>Activity log dari webhook yang diterima</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-gray-900 rounded-md p-4 overflow-y-auto">
          {activityLog.length === 0 ? (
            <p className="text-gray-500 text-sm">Menunggu webhook dari bank...</p>
          ) : (
            <div className="space-y-2">
              {activityLog.map((log, idx) => (
                <p key={idx} className="text-green-400 text-sm font-mono">
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface WebhookEventsCardProps {
  events: typeof import('@/data/mock-integrations').mockWebhookEvents;
}

function WebhookEventsCard({ events }: WebhookEventsCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Events</CardTitle>
        <CardDescription>Log webhook yang diterima dari bank</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyWebhookState />
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <WebhookEventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyWebhookState(): React.ReactElement {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Wifi className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p>Belum ada webhook events</p>
      <p className="text-sm">Coba simulasi webhook di tab Simulasi</p>
    </div>
  );
}

interface WebhookEventRowProps {
  event: typeof import('@/data/mock-integrations').mockWebhookEvents[0];
}

function WebhookEventRow({ event }: WebhookEventRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <p className="font-medium">
            {event.bankCode} - {event.virtualAccountNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            {event.senderName || 'Unknown sender'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">{formatCurrency(event.amount)}</p>
        <WebhookStatusBadge status={event.status} />
      </div>
    </div>
  );
}
