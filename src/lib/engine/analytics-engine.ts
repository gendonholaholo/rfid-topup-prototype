import { Transaction, Customer } from '@/types';
import {
  CustomerAnalytics,
  DashboardAnalytics,
  RegionSummary,
  XenditUsageStats,
  TrendChartData,
  TopupSummary,
} from '@/types/analytics';
import { PERTAMINA_REGIONS } from '@/data/regions';

// ===========================================
// CONSTANTS
// ===========================================

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Default mock values for demo when no real data exists
const MOCK_GROWTH_PERCENTAGE = 12.5;
const MOCK_ACTIVE_CUSTOMERS = 45;
const MOCK_AVERAGE_TOPUP = 16500000;

// ===========================================
// MOCK DATA GENERATORS FOR PROTOTYPE
// ===========================================

export function generateMockMonthlyTrend(months: number = 12): TrendChartData[] {
  const data: TrendChartData[] = [];
  const currentMonth = new Date().getMonth();

  for (let i = months - 1; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const baseAmount = 150000000 + Math.random() * 100000000;
    // Higher volume in Dec-Feb (holiday season)
    const seasonalFactor = monthIndex >= 10 || monthIndex <= 1 ? 1.3 : 1;

    data.push({
      month: MONTHS[monthIndex],
      amount: Math.round(baseAmount * seasonalFactor),
      count: Math.round(80 + Math.random() * 60),
    });
  }

  return data;
}

export function generateMockYearlyTrend(years: number = 3): TrendChartData[] {
  const currentYear = new Date().getFullYear();
  const data: TrendChartData[] = [];

  for (let i = years - 1; i >= 0; i--) {
    const year = currentYear - i;
    const growthFactor = 1 + (years - 1 - i) * 0.15; // 15% YoY growth

    data.push({
      month: year.toString(),
      amount: Math.round(2000000000 * growthFactor),
      count: Math.round(1000 * growthFactor),
    });
  }

  return data;
}

export function generateMockRegionSummary(): RegionSummary[] {
  const mockData: { amount: number; count: number }[] = [
    { amount: 180000000, count: 15 },  // R1 Sumbagut
    { amount: 150000000, count: 12 },  // R2 Sumbagsel
    { amount: 420000000, count: 35 },  // R3 Jakarta Banten
    { amount: 340000000, count: 28 },  // R4 Jawa Bagian Barat
    { amount: 220000000, count: 18 },  // R5 Jawa Bagian Tengah
    { amount: 280000000, count: 22 },  // R6 Jatimbalinus
    { amount: 120000000, count: 10 },  // R7 Indonesia Bagian Timur
  ];

  const totalAmount = mockData.reduce((sum, d) => sum + d.amount, 0);

  return PERTAMINA_REGIONS.map((region, i) => ({
    regionCode: region.code,
    regionName: region.shortName,
    totalAmount: mockData[i].amount,
    transactionCount: mockData[i].count,
    percentage: Math.round((mockData[i].amount / totalAmount) * 100),
  }));
}

// ===========================================
// ANALYTICS CALCULATIONS
// ===========================================

export function calculateDashboardAnalytics(
  transactions: Transaction[],
  customers: Customer[]
): DashboardAnalytics {
  const { thisMonthTransactions, lastMonthTransactions } = filterTransactionsByMonth(transactions);

  const totalThisMonth = sumTransactionAmounts(thisMonthTransactions);
  const totalLastMonth = sumTransactionAmounts(lastMonthTransactions);

  const growthPercentage = calculateGrowthPercentage(totalThisMonth, totalLastMonth);
  const xenditUsage = calculateXenditUsage(transactions);
  const topCustomers = calculateTopCustomers(transactions, customers);

  const monthlyTrend = generateMockMonthlyTrend(12);
  const yearlyTrend = generateMockYearlyTrend(3);
  const regionSummary = generateMockRegionSummary();

  return {
    summary: buildSummary(
      thisMonthTransactions,
      lastMonthTransactions,
      totalThisMonth,
      totalLastMonth,
      growthPercentage,
      customers.length,
      monthlyTrend
    ),
    monthlyTrend: transformToTopupSummary(monthlyTrend, 'monthly'),
    yearlyTrend: transformToTopupSummary(yearlyTrend, 'yearly'),
    topCustomers,
    xenditUsage,
    regionSummary,
  };
}

function filterTransactionsByMonth(transactions: Transaction[]): {
  thisMonthTransactions: Transaction[];
  lastMonthTransactions: Transaction[];
} {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear && t.status === 'success';
  });

  const lastMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.createdAt);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && t.status === 'success';
  });

  return { thisMonthTransactions, lastMonthTransactions };
}

function sumTransactionAmounts(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous <= 0) return 0;
  return ((current - previous) / previous) * 100;
}

function buildSummary(
  thisMonthTransactions: Transaction[],
  lastMonthTransactions: Transaction[],
  totalThisMonth: number,
  totalLastMonth: number,
  growthPercentage: number,
  customerCount: number,
  monthlyTrend: TrendChartData[]
): DashboardAnalytics['summary'] {
  const lastTrend = monthlyTrend[monthlyTrend.length - 1];
  const secondLastTrend = monthlyTrend[monthlyTrend.length - 2];

  return {
    totalTopupThisMonth: totalThisMonth || lastTrend?.amount || 0,
    totalTopupLastMonth: totalLastMonth || secondLastTrend?.amount || 0,
    transactionCountThisMonth: thisMonthTransactions.length || lastTrend?.count || 0,
    transactionCountLastMonth: lastMonthTransactions.length || secondLastTrend?.count || 0,
    growthPercentage: growthPercentage || MOCK_GROWTH_PERCENTAGE,
    activeCustomers: customerCount || MOCK_ACTIVE_CUSTOMERS,
    averageTopup: totalThisMonth / (thisMonthTransactions.length || 1) || MOCK_AVERAGE_TOPUP,
  };
}

function transformToTopupSummary(
  data: TrendChartData[],
  period: 'monthly' | 'yearly'
): TopupSummary[] {
  return data.map((item) => ({
    period,
    date: item.month,
    month: period === 'monthly' ? item.month : undefined,
    year: period === 'yearly' ? parseInt(item.month, 10) : undefined,
    totalAmount: item.amount,
    transactionCount: item.count,
    averageAmount: item.amount / item.count,
    growthPercentage: 0,
  }));
}

function calculateXenditUsage(transactions: Transaction[]): XenditUsageStats {
  const successTransactions = transactions.filter((t) => t.status === 'success');

  if (successTransactions.length === 0) {
    return {
      xendit: { count: 0, amount: 0, percentage: 100 },
    };
  }

  return {
    xendit: {
      count: successTransactions.length,
      amount: sumTransactionAmounts(successTransactions),
      percentage: 100,
    },
  };
}

function calculateTopCustomers(
  transactions: Transaction[],
  customers: Customer[]
): CustomerAnalytics[] {
  // Return mock data for demo if no transactions
  if (transactions.length === 0) {
    return customers.slice(0, 5).map((customer, index) => ({
      customerId: customer.id,
      customerName: customer.companyName,
      companyName: customer.companyName,
      totalTopup: [42000000, 25000000, 15000000, 8500000, 5000000][index] || 5000000,
      transactionCount: [12, 8, 5, 3, 2][index] || 2,
      averageTopup: [3500000, 3125000, 3000000, 2833333, 2500000][index] || 2500000,
      lastTopupDate: new Date().toISOString(),
      monthlyTrend: [],
    }));
  }

  const customerMap = new Map<string, { amount: number; count: number }>();

  transactions
    .filter((t) => t.status === 'success')
    .forEach((t) => {
      const current = customerMap.get(t.customerId) || { amount: 0, count: 0 };
      customerMap.set(t.customerId, {
        amount: current.amount + t.amount,
        count: current.count + 1,
      });
    });

  const sorted = Array.from(customerMap.entries())
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 5);

  return sorted.map(([customerId, data]) => {
    const customer = customers.find((c) => c.id === customerId);
    return {
      customerId,
      customerName: customer?.companyName || 'Unknown',
      companyName: customer?.companyName || 'Unknown',
      totalTopup: data.amount,
      transactionCount: data.count,
      averageTopup: data.amount / data.count,
      lastTopupDate: new Date().toISOString(),
      monthlyTrend: [],
    };
  });
}

// ===========================================
// CHART DATA FORMATTERS
// ===========================================

export function formatChartAmount(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}M`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}jt`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}rb`;
  }
  return value.toString();
}

type GrowthIcon = 'up' | 'down' | 'neutral';

interface GrowthIndicator {
  icon: GrowthIcon;
  color: string;
  text: string;
}

export function getGrowthIndicator(percentage: number): GrowthIndicator {
  if (percentage > 0) {
    return {
      icon: 'up',
      color: 'text-green-600',
      text: `+${percentage.toFixed(1)}%`,
    };
  }
  if (percentage < 0) {
    return {
      icon: 'down',
      color: 'text-red-600',
      text: `${percentage.toFixed(1)}%`,
    };
  }
  return {
    icon: 'neutral',
    color: 'text-gray-600',
    text: '0%',
  };
}
