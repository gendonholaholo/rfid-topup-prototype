'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

// ===========================================
// INFO BANNER COMPONENT
// Gradient banner for plan page introductions
// ===========================================

type BannerVariant = 'blue' | 'purple' | 'green';

interface InfoBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: BannerVariant;
}

const VARIANT_STYLES: Record<BannerVariant, { border: string; bg: string; iconBg: string }> = {
  blue: {
    border: 'border-blue-200',
    bg: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30',
    iconBg: 'bg-blue-600',
  },
  purple: {
    border: 'border-purple-200',
    bg: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30',
    iconBg: 'bg-purple-600',
  },
  green: {
    border: 'border-green-200',
    bg: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30',
    iconBg: 'bg-green-600',
  },
};

export function InfoBanner({ title, description, icon: Icon, variant }: InfoBannerProps): React.ReactElement {
  const styles = VARIANT_STYLES[variant];

  return (
    <Card className={`${styles.border} ${styles.bg}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p
              className="text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
