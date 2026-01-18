'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  PieChart,
  Pie,
  Cell,
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
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  Calendar,
  LucideIcon,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/data/mock-data';
import {
  calculateDashboardAnalytics,
  generateMockMonthlyTrend,
  formatChartAmount,
} from '@/lib/engine/analytics-engine';
import { getRankBadgeStyle } from '@/lib/utils/style-helpers';
import { PlanUsageStats, CustomerAnalytics } from '@/types/analytics';

// ===========================================
// CONSTANTS
// ===========================================

const PLAN_COLORS = {
  planA: '#3B82F6',
  planB: '#8B5CF6',
  planC: '#10B981',
};

type PeriodType = 'monthly' | 'yearly';

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function DashboardAnalyticsPage(): React.ReactElement {
  const transactions = useStore((state) => state.transactions);
  const customers = useStore((state) => state.customers);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');

  const analytics = useMemo(
    () => calculateDashboardAnalytics(transactions, customers),
    [transactions, customers]
  );

  const monthlyChartData = useMemo(() => generateMockMonthlyTrend(12), []);

  const planUsageData = [
    { name: 'Plan A', value: analytics.planUsage.planA.percentage, color: PLAN_COLORS.planA },
    { name: 'Plan B', value: analytics.planUsage.planB.percentage, color: PLAN_COLORS.planB },
    { name: 'Plan C', value: analytics.planUsage.planC.percentage, color: PLAN_COLORS.planC },
  ];

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <DashboardHeader />

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

        <div className="grid gap-6 lg:grid-cols-3">
          <MonthlyTrendChart
            data={monthlyChartData}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
          <PlanUsageChart data={planUsageData} planUsage={analytics.planUsage} />
        </div>

        <TransactionCountChart data={monthlyChartData} />

        <TopCustomersTable customers={analytics.topCustomers} />

        <PlanSummaryCards planUsage={analytics.planUsage} />
      </div>
    </MainLayout>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

function DashboardHeader(): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
        <p className="text-muted-foreground">
          Monitoring summary top-up RFID per bulan dan per tahun
        </p>
      </div>
      <Button variant="outline" size="sm">
        <Calendar className="mr-2 h-4 w-4" />
        Januari 2026
      </Button>
    </div>
  );
}

// ===========================================
// SUMMARY CARDS
// ===========================================

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

// ===========================================
// CHARTS
// ===========================================

interface MonthlyTrendChartProps {
  data: Array<{ month: string; amount: number; count: number }>;
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

function MonthlyTrendChart({
  data,
  selectedPeriod,
  onPeriodChange,
}: MonthlyTrendChartProps): React.ReactElement {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trend Top-Up Bulanan</CardTitle>
            <CardDescription>Fluktuasi top-up RFID per bulan</CardDescription>
          </div>
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
                labelFormatter={(label) => `Bulan: ${label}`}
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

interface PlanUsageChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  planUsage: PlanUsageStats;
}

function PlanUsageChart({ data, planUsage }: PlanUsageChartProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Penggunaan per Plan</CardTitle>
        <CardDescription>Distribusi transaksi berdasarkan metode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Persentase']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <PlanUsageLegend planUsage={planUsage} />
      </CardContent>
    </Card>
  );
}

interface PlanUsageLegendProps {
  planUsage: PlanUsageStats;
}

function PlanUsageLegend({ planUsage }: PlanUsageLegendProps): React.ReactElement {
  const items = [
    { color: 'bg-blue-500', label: 'Plan A (Payment Gateway)', value: planUsage.planA.percentage },
    { color: 'bg-purple-500', label: 'Plan B (Bank Webhook)', value: planUsage.planB.percentage },
    { color: 'bg-green-500', label: 'Plan C (File Import)', value: planUsage.planC.percentage },
  ];

  return (
    <div className="space-y-2 mt-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-sm">{item.label}</span>
          </div>
          <span className="font-medium">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}

interface TransactionCountChartProps {
  data: Array<{ month: string; amount: number; count: number }>;
}

function TransactionCountChart({ data }: TransactionCountChartProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jumlah Transaksi per Bulan</CardTitle>
        <CardDescription>Perbandingan jumlah transaksi setiap bulan</CardDescription>
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
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ===========================================
// TOP CUSTOMERS TABLE
// ===========================================

interface TopCustomersTableProps {
  customers: CustomerAnalytics[];
}

function TopCustomersTable({ customers }: TopCustomersTableProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Customer</CardTitle>
        <CardDescription>Pelanggan dengan top-up tertinggi</CardDescription>
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

// ===========================================
// PLAN SUMMARY CARDS
// ===========================================

interface PlanSummaryCardsProps {
  planUsage: PlanUsageStats;
}

function PlanSummaryCards({ planUsage }: PlanSummaryCardsProps): React.ReactElement {
  const plans = [
    {
      name: 'Plan A',
      subtitle: 'Payment Gateway',
      icon: CreditCard,
      data: planUsage.planA,
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Plan B',
      subtitle: 'Bank Webhook',
      icon: Building2,
      data: planUsage.planB,
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50/50 dark:bg-purple-950/20',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Plan C',
      subtitle: 'File Import',
      icon: FileSpreadsheet,
      data: planUsage.planC,
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50/50 dark:bg-green-950/20',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <PlanSummaryCard key={plan.name} {...plan} />
      ))}
    </div>
  );
}

interface PlanSummaryCardProps {
  name: string;
  subtitle: string;
  icon: LucideIcon;
  data: { count: number; amount: number };
  borderColor: string;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

function PlanSummaryCard({
  name,
  subtitle,
  icon: Icon,
  data,
  borderColor,
  bgColor,
  iconBgColor,
  iconColor,
}: PlanSummaryCardProps): React.ReactElement {
  return (
    <Card className={`${borderColor} ${bgColor}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-medium">{formatCurrency(data.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Transaksi</span>
            <span className="font-medium">{data.count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
