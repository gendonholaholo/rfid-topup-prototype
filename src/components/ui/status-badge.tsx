import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ===========================================
// STATUS BADGE COMPONENT
// Reusable component for displaying status indicators
// ===========================================

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const STATUS_STYLES: Record<StatusVariant, string> = {
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  neutral: 'bg-gray-500 text-white',
};

const STATUS_VARIANT_MAP: Record<string, StatusVariant> = {
  paid: 'success',
  success: 'success',
  verified: 'success',
  completed: 'success',
  active: 'success',
  pending: 'warning',
  testing: 'warning',
  failed: 'error',
  expired: 'error',
  rejected: 'error',
  error: 'error',
  blocked: 'error',
  inactive: 'neutral',
};

function getVariantFromStatus(status: string): StatusVariant {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, '');
  return STATUS_VARIANT_MAP[normalizedStatus] || 'neutral';
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps): React.ReactElement {
  const resolvedVariant = variant || getVariantFromStatus(status);

  return (
    <Badge className={cn(STATUS_STYLES[resolvedVariant], className)}>
      {status}
    </Badge>
  );
}

// ===========================================
// SPECIALIZED BADGES
// ===========================================

interface TransactionStatusBadgeProps {
  status: 'pending' | 'paid' | 'expired' | 'failed' | 'success';
  className?: string;
}

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps): React.ReactElement {
  return <StatusBadge status={status} className={className} />;
}
