'use client';

import React from 'react';
import Link from 'next/link';
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
  CreditCard,
  Building2,
  FileSpreadsheet,
  ArrowRight,
  Zap,
  Clock,
  MousePointer,
  CheckCircle2,
  AlertCircle,
  Info,
  LucideIcon,
} from 'lucide-react';
import { useIntegrationStore } from '@/store/useIntegrationStore';
import { PlanType } from '@/types/integrations';

// ===========================================
// PLAN CONFIGURATION
// ===========================================

interface PlanFeature {
  icon: LucideIcon;
  text: string;
}

interface PlanConfig {
  id: PlanType;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  features: PlanFeature[];
  pros: string[];
  cons: string[];
  href: string;
  automationLevel: string;
  automationColor: string;
}

const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'A',
    title: 'Plan A',
    subtitle: 'Payment Gateway',
    description: 'Integrasi dengan payment gateway seperti Xendit, Midtrans untuk pembayaran real-time.',
    icon: CreditCard,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    borderColor: 'border-blue-200',
    features: [
      { icon: Zap, text: 'Real-time payment' },
      { icon: CheckCircle2, text: 'Auto-verified' },
      { icon: CreditCard, text: 'Multiple VA banks' },
    ],
    pros: ['Fully automated', 'Instant verification', 'Real-time dashboard'],
    cons: ['Ada fee per transaksi', 'Perlu setup merchant'],
    href: '/admin/integration/plan-a',
    automationLevel: 'Full Auto',
    automationColor: 'bg-green-500',
  },
  {
    id: 'B',
    title: 'Plan B',
    subtitle: 'Bank API Webhook',
    description: 'Terima notifikasi otomatis dari bank setiap ada transaksi masuk via webhook.',
    icon: Building2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    borderColor: 'border-purple-200',
    features: [
      { icon: Zap, text: 'Semi real-time' },
      { icon: CheckCircle2, text: 'Auto-matching' },
      { icon: Building2, text: 'Direct bank API' },
    ],
    pros: ['Tidak ada fee transaksi', 'Data langsung dari bank', 'Matching otomatis'],
    cons: ['Perlu partnership bank', 'Setup lebih kompleks'],
    href: '/admin/integration/plan-b',
    automationLevel: 'Semi-Auto',
    automationColor: 'bg-yellow-500',
  },
  {
    id: 'C',
    title: 'Plan C',
    subtitle: 'File Import',
    description: 'Import rekening koran dari file CSV/Excel secara manual kemudian matching otomatis.',
    icon: FileSpreadsheet,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    borderColor: 'border-green-200',
    features: [
      { icon: Clock, text: 'Batch processing' },
      { icon: MousePointer, text: '1-click verify' },
      { icon: FileSpreadsheet, text: 'CSV/Excel support' },
    ],
    pros: ['Tidak perlu integrasi', 'Bisa langsung digunakan', 'Biaya rendah'],
    cons: ['Semi-manual', 'Ada delay waktu', 'Perlu upload rutin'],
    href: '/admin/integration/plan-c',
    automationLevel: 'Manual',
    automationColor: 'bg-gray-500',
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function IntegrationHubPage(): React.ReactElement {
  const { isPlanActive } = useIntegrationStore();

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <PageHeader />
        <InfoBanner />
        <PlanCardsGrid plans={PLAN_CONFIGS} isPlanActive={isPlanActive} />
        <ComparisonTable />
      </div>
    </MainLayout>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

function PageHeader(): React.ReactElement {
  return (
    <div>
      <h1 className="text-2xl font-bold">Integration Hub</h1>
      <p className="text-muted-foreground">
        Pilih metode integrasi untuk menerima data pembayaran
      </p>
    </div>
  );
}

function InfoBanner(): React.ReactElement {
  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Anda dapat menggunakan beberapa metode sekaligus
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Sistem akan otomatis mendeteksi sumber transaksi dan mencocokkan dengan data Webreport.
              Pilih metode yang paling sesuai dengan kebutuhan dan kapabilitas perusahaan.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PlanCardsGridProps {
  plans: PlanConfig[];
  isPlanActive: (plan: PlanType) => boolean;
}

function PlanCardsGrid({ plans, isPlanActive }: PlanCardsGridProps): React.ReactElement {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} isActive={isPlanActive(plan.id)} />
      ))}
    </div>
  );
}

interface PlanCardProps {
  plan: PlanConfig;
  isActive: boolean;
}

function PlanCard({ plan, isActive }: PlanCardProps): React.ReactElement {
  const Icon = plan.icon;
  const cardClass = isActive ? `border-2 ${plan.borderColor}` : '';

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${cardClass}`}>
      <AutomationBadge level={plan.automationLevel} color={plan.automationColor} />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl ${plan.bgColor} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${plan.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{plan.title}</CardTitle>
            <CardDescription className="font-medium">{plan.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{plan.description}</p>

        <FeatureList features={plan.features} color={plan.color} />

        <ProsConsList pros={plan.pros} cons={plan.cons} />

        <Button asChild className="w-full mt-4">
          <Link href={plan.href}>
            {isActive ? 'Konfigurasi' : 'Lihat Detail'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface AutomationBadgeProps {
  level: string;
  color: string;
}

function AutomationBadge({ level, color }: AutomationBadgeProps): React.ReactElement {
  return (
    <div className="absolute top-3 right-3">
      <Badge className={`${color} text-white`}>{level}</Badge>
    </div>
  );
}

interface FeatureListProps {
  features: PlanFeature[];
  color: string;
}

function FeatureList({ features, color }: FeatureListProps): React.ReactElement {
  return (
    <div className="space-y-2">
      {features.map((feature, idx) => {
        const FeatureIcon = feature.icon;
        return (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <FeatureIcon className={`h-4 w-4 ${color}`} />
            <span>{feature.text}</span>
          </div>
        );
      })}
    </div>
  );
}

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

function ProsConsList({ pros, cons }: ProsConsListProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
      <div>
        <p className="text-xs font-medium text-green-600 mb-1">Kelebihan</p>
        {pros.map((pro, idx) => (
          <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
            {pro}
          </p>
        ))}
      </div>
      <div>
        <p className="text-xs font-medium text-orange-600 mb-1">Pertimbangan</p>
        {cons.map((con, idx) => (
          <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
            <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
            {con}
          </p>
        ))}
      </div>
    </div>
  );
}

function ComparisonTable(): React.ReactElement {
  const comparisonData = [
    {
      aspect: 'Waktu Proses',
      planA: { text: 'Instant', color: 'bg-green-50' },
      planB: { text: '< 5 menit', color: 'bg-yellow-50' },
      planC: { text: 'Tergantung import', color: 'bg-gray-50' },
    },
    {
      aspect: 'Biaya Transaksi',
      planA: { text: 'Rp 3-4rb/trx' },
      planB: { text: 'Gratis' },
      planC: { text: 'Gratis' },
    },
    {
      aspect: 'Setup',
      planA: { text: 'Medium' },
      planB: { text: 'Kompleks' },
      planC: { text: 'Mudah' },
    },
    {
      aspect: 'Intervensi Admin',
      planA: { text: 'Tidak perlu' },
      planB: { text: '1-click verify' },
      planC: { text: 'Upload + verify' },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbandingan Ringkas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aspek</TableHead>
                <TableHead className="text-center">Plan A</TableHead>
                <TableHead className="text-center">Plan B</TableHead>
                <TableHead className="text-center">Plan C</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.aspect}</TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell data={row.planA} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell data={row.planB} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell data={row.planC} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonCellProps {
  data: { text: string; color?: string };
}

function ComparisonCell({ data }: ComparisonCellProps): React.ReactElement {
  if (data.color) {
    return (
      <Badge variant="outline" className={data.color}>
        {data.text}
      </Badge>
    );
  }
  return <span className="text-muted-foreground">{data.text}</span>;
}
