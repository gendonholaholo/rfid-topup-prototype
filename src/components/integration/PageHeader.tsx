'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LucideIcon } from 'lucide-react';

// ===========================================
// PAGE HEADER COMPONENT
// Consistent header with back navigation for plan pages
// ===========================================

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  backHref?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  backHref = '/admin/integration',
}: PageHeaderProps): React.ReactElement {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href={backHref}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Icon className={`h-6 w-6 ${iconColor}`} />
          {title}
        </h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
