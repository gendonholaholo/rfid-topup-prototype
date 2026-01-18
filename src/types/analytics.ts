// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface TopupSummary {
  period: 'daily' | 'monthly' | 'yearly';
  date: string;
  month?: string;
  year?: number;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  growthPercentage: number;
}

export interface CustomerAnalytics {
  customerId: string;
  customerName: string;
  companyName: string;
  totalTopup: number;
  transactionCount: number;
  averageTopup: number;
  lastTopupDate: string;
  monthlyTrend: TopupSummary[];
}

export interface PlanUsageStats {
  planA: {
    count: number;
    amount: number;
    percentage: number;
  };
  planB: {
    count: number;
    amount: number;
    percentage: number;
  };
  planC: {
    count: number;
    amount: number;
    percentage: number;
  };
}

export interface DashboardAnalytics {
  summary: {
    totalTopupThisMonth: number;
    totalTopupLastMonth: number;
    transactionCountThisMonth: number;
    transactionCountLastMonth: number;
    growthPercentage: number;
    activeCustomers: number;
    averageTopup: number;
  };
  monthlyTrend: TopupSummary[];
  yearlyTrend: TopupSummary[];
  topCustomers: CustomerAnalytics[];
  planUsage: PlanUsageStats;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  amount?: number;
  count?: number;
}

export interface TrendChartData {
  month: string;
  amount: number;
  count: number;
}
