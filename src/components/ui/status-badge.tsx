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

// Common status mappings for auto-detection
const STATUS_VARIANT_MAP: Record<string, StatusVariant> = {
  // Transaction statuses
  paid: 'success',
  success: 'success',
  verified: 'success',
  completed: 'success',
  processed: 'success',
  active: 'success',
  connected: 'success',
  // Warning statuses
  pending: 'warning',
  received: 'warning',
  uploading: 'warning',
  parsing: 'warning',
  validating: 'warning',
  importing: 'warning',
  testing: 'warning',
  // Error statuses
  failed: 'error',
  expired: 'error',
  rejected: 'error',
  error: 'error',
  blocked: 'error',
  // Neutral statuses
  inactive: 'neutral',
  disconnected: 'neutral',
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

interface WebhookStatusBadgeProps {
  status: 'received' | 'processed' | 'failed';
  className?: string;
}

export function WebhookStatusBadge({ status, className }: WebhookStatusBadgeProps): React.ReactElement {
  return <StatusBadge status={status} className={className} />;
}

interface ImportStatusBadgeProps {
  status: 'uploading' | 'parsing' | 'validating' | 'importing' | 'completed' | 'failed';
  className?: string;
}

export function ImportStatusBadge({ status, className }: ImportStatusBadgeProps): React.ReactElement {
  return <StatusBadge status={status} className={className} />;
}
