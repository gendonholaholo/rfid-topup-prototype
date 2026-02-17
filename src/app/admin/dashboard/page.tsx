'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  DollarSign,
  Activity,
  ArrowUpRight,
  Calendar,
  Target,
  Download,
  LucideIcon,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/data/mock-data';
import {
  calculateDashboardAnalytics,
  generateMockMonthlyTrend,
  generateMockYearlyTrend,
  formatChartAmount,
} from '@/lib/engine/analytics-engine';
import { getRankBadgeStyle } from '@/lib/utils/style-helpers';
import { downloadCSV, csvFilename } from '@/lib/utils/download-csv';
import { CustomerAnalytics, RegionSummary } from '@/types/analytics';

type PeriodType = 'monthly' | 'yearly';

export default function DashboardAnalyticsPage(): React.ReactElement {
  const transactions = useStore((state) => state.transactions);
  const customers = useStore((state) => state.customers);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');

  const analytics = useMemo(
    () => calculateDashboardAnalytics(transactions, customers),
    [transactions, customers]
  );

  const monthlyChartData = useMemo(() => generateMockMonthlyTrend(12), []);
  const yearlyChartData = useMemo(() => generateMockYearlyTrend(3), []);

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <DashboardHeader
          topCustomers={analytics.topCustomers}
          regionSummary={analytics.regionSummary}
        />

        <SummaryCards
          totalThisMonth={analytics.summary.totalTopupThisMonth}
          growthPercentage={analytics.summary.growthPercentage}
          transactionCount={analytics.summary.transactionCountThisMonth}
          transactionDelta={
            analytics.summary.transactionCountThisMonth -
            analytics.summary.transactionCountLastMonth
          }
          averageTopup={analytics.summary.averageTopup}
          activeCustomers={analytics.summary.activeCustomers}
        />

        {/* Xendit Summary Card */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Xendit Payment Gateway</p>
                <p className="text-sm text-muted-foreground">Semua transaksi diproses via Xendit</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <p className="font-medium">{formatCurrency(analytics.xenditUsage.xendit.amount)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Transaksi</span>
                <p className="font-medium">{analytics.xenditUsage.xendit.count}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Coverage</span>
                <p className="font-medium">{analytics.xenditUsage.xendit.percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <RegionSummaryTable regions={analytics.regionSummary} />

        <TrendChart
          data={selectedPeriod === 'monthly' ? monthlyChartData : yearlyChartData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        <TransactionCountChart
          data={selectedPeriod === 'monthly' ? monthlyChartData : yearlyChartData}
          selectedPeriod={selectedPeriod}
        />

        <TopCustomersTable customers={analytics.topCustomers} />
      </div>
    </MainLayout>
  );
}

interface DashboardHeaderProps {
  topCustomers: CustomerAnalytics[];
  regionSummary: RegionSummary[];
}

function DashboardHeader({ topCustomers, regionSummary }: DashboardHeaderProps): React.ReactElement {
  const handleDownload = () => {
    type ReportRow = { section: string; label: string; value: string; extra: string };
    const rows: ReportRow[] = [];

    rows.push({ section: 'Top Customer', label: 'Perusahaan', value: 'Total Top-Up', extra: 'Jumlah Trx' });
    topCustomers.forEach((c) => {
      rows.push({
        section: '',
        label: c.companyName,
        value: formatCurrency(c.totalTopup),
        extra: String(c.transactionCount),
      });
    });

    rows.push({ section: '', label: '', value: '', extra: '' });
    rows.push({ section: 'Region', label: 'Nama Region', value: 'Total Top-Up', extra: 'Jumlah Trx' });
    regionSummary.forEach((r) => {
      rows.push({
        section: '',
        label: `R${r.regionCode} ${r.regionName}`,
        value: formatCurrency(r.totalAmount),
        extra: String(r.transactionCount),
      });
    });

    downloadCSV(csvFilename('dashboard-report'), [
      { header: 'Bagian', accessor: (r: ReportRow) => r.section },
      { header: 'Label', accessor: (r: ReportRow) => r.label },
      { header: 'Nilai', accessor: (r: ReportRow) => r.value },
      { header: 'Detail', accessor: (r: ReportRow) => r.extra },
    ], rows);
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Februari 2026
        </Button>
      </div>
    </div>
  );
}

interface SummaryCardsProps {
  totalThisMonth: number;
  growthPercentage: number;
  transactionCount: number;
  transactionDelta: number;
  averageTopup: number;
  activeCustomers: number;
}

function SummaryCards({
  totalThisMonth,
  growthPercentage,
  transactionCount,
  transactionDelta,
  averageTopup,
  activeCustomers,
}: SummaryCardsProps): React.ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Top-Up Bulan Ini"
        value={formatCurrency(totalThisMonth)}
        subtext={
          <GrowthIndicator
            value={growthPercentage}
            suffix="vs bulan lalu"
          />
        }
        icon={DollarSign}
        iconBgColor="bg-green-100 dark:bg-green-900"
        iconColor="text-green-600"
      />
      <SummaryCard
        title="Jumlah Transaksi"
        value={transactionCount.toString()}
        subtext={
          <span className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4" />
            +{transactionDelta} vs bulan lalu
          </span>
        }
        icon={Activity}
        iconBgColor="bg-blue-100 dark:bg-blue-900"
        iconColor="text-blue-600"
      />
      <SummaryCard
        title="Rata-rata Top-Up"
        value={formatCurrency(averageTopup)}
        subtext={<span className="text-sm text-muted-foreground">per transaksi</span>}
        icon={CreditCard}
        iconBgColor="bg-purple-100 dark:bg-purple-900"
        iconColor="text-purple-600"
      />
      <SummaryCard
        title="Customer Aktif"
        value={activeCustomers.toString()}
        subtext={<span className="text-sm text-muted-foreground">perusahaan</span>}
        icon={Users}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  subtext: React.ReactNode;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

function SummaryCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBgColor,
  iconColor,
}: SummaryCardProps): React.ReactElement {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="mt-1">{subtext}</div>
          </div>
          <div
            className={`h-12 w-12 rounded-full ${iconBgColor} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GrowthIndicatorProps {
  value: number;
  suffix: string;
}

function GrowthIndicator({ value, suffix }: GrowthIndicatorProps): React.ReactElement {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  const prefix = isPositive ? '+' : '';

  return (
    <div className="flex items-center gap-1">
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className={`text-sm ${colorClass}`}>
        {prefix}{value.toFixed(1)}% {suffix}
      </span>
    </div>
  );
}

interface TrendChartProps {
  data: Array<{ month: string; amount: number; count: number }>;
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

function TrendChart({
  data,
  selectedPeriod,
  onPeriodChange,
}: TrendChartProps): React.ReactElement {
  const isMonthly = selectedPeriod === 'monthly';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{isMonthly ? 'Trend Top-Up Bulanan' : 'Trend Top-Up Tahunan'}</CardTitle>
          <Tabs
            value={selectedPeriod}
            onValueChange={(v) => onPeriodChange(v as PeriodType)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="monthly" className="text-xs">
                Bulanan
              </TabsTrigger>
              <TabsTrigger value="yearly" className="text-xs">
                Tahunan
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis tickFormatter={formatChartAmount} className="text-xs" />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value) || 0), 'Total Top-Up']}
                labelFormatter={(label) => `${isMonthly ? 'Bulan' : 'Tahun'}: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface TransactionCountChartProps {
  data: Array<{ month: string; amount: number; count: number }>;
  selectedPeriod: PeriodType;
}

function TransactionCountChart({ data, selectedPeriod }: TransactionCountChartProps): React.ReactElement {
  const isMonthly = selectedPeriod === 'monthly';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isMonthly ? 'Jumlah Transaksi per Bulan' : 'Jumlah Transaksi per Tahun'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value) => [value, 'Transaksi']}
                labelFormatter={(label) => `${isMonthly ? 'Bulan' : 'Tahun'}: ${label}`}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

const REGION_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
];

interface RegionSummaryTableProps {
  regions: RegionSummary[];
}

function RegionSummaryTable({ regions }: RegionSummaryTableProps): React.ReactElement {
  const totalAmount = regions.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <Target className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <CardTitle>Summary per Region</CardTitle>
            <p className="text-sm text-muted-foreground">Ringkasan transaksi dan customer per region</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Total Top-Up</TableHead>
              <TableHead className="text-center">Trx</TableHead>
              <TableHead className="text-center">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.map((region, index) => (
              <TableRow key={region.regionCode}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${REGION_COLORS[index % REGION_COLORS.length]}`} />
                    <span className="font-medium">R{region.regionCode} {region.regionName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(region.totalAmount)}
                </TableCell>
                <TableCell className="text-center">{region.transactionCount}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {region.percentage}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-sm font-medium text-muted-foreground">Total Semua Region:</span>
          <span className="text-lg font-bold">{formatCurrency(totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface TopCustomersTableProps {
  customers: CustomerAnalytics[];
}

function TopCustomersTable({ customers }: TopCustomersTableProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {customers.length} Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead className="text-right">Total Top-Up</TableHead>
              <TableHead className="text-center">Transaksi</TableHead>
              <TableHead className="text-right">Rata-rata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.customerId}>
                <TableCell>
                  <Badge variant="outline" className={getRankBadgeStyle(index + 1)}>
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{customer.companyName}</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(customer.totalTopup)}
                </TableCell>
                <TableCell className="text-center">{customer.transactionCount}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(customer.averageTopup)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
