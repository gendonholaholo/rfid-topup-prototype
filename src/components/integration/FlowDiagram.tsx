'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap } from 'lucide-react';

// ===========================================
// FLOW DIAGRAM COMPONENT
// Reusable component for showing step-by-step payment flows
// ===========================================

interface FlowStep {
  label: string;
  color: 'blue' | 'purple' | 'yellow' | 'green' | 'emerald';
}

interface FlowDiagramProps {
  title: string;
  steps: FlowStep[];
  timing: string;
  useZapIcon?: boolean;
}

const STEP_COLORS: Record<FlowStep['color'], { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
};

export function FlowDiagram({ title, steps, timing, useZapIcon = false }: FlowDiagramProps): React.ReactElement {
  const ConnectorIcon = useZapIcon ? Zap : ArrowRight;
  const connectorClass = useZapIcon ? 'text-yellow-500' : 'text-muted-foreground';

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="font-medium mb-4 text-center">{title}</h4>
        <div className="flex items-center justify-center gap-4 overflow-x-auto py-4">
          {steps.map((step, index) => {
            const colors = STEP_COLORS[step.color];
            const stepNumber = index + 1;

            return (
              <div key={index} className="contents">
                <div className="text-center min-w-[100px]">
                  <div
                    className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className={`text-sm font-bold ${colors.text}`}>{stepNumber}</span>
                  </div>
                  <p className="text-xs">{step.label}</p>
                </div>
                {index < steps.length - 1 && (
                  <ConnectorIcon className={`h-4 w-4 ${connectorClass}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">{timing}</p>
      </CardContent>
    </Card>
  );
}

// ===========================================
// PREDEFINED FLOW CONFIGURATIONS
// ===========================================

export const PLAN_A_FLOW: FlowStep[] = [
  { label: 'Customer Transfer', color: 'blue' },
  { label: 'Gateway Process', color: 'purple' },
  { label: 'Callback ke IMPAZZ', color: 'green' },
  { label: 'Saldo Update', color: 'yellow' },
];

export const PLAN_B_FLOW: FlowStep[] = [
  { label: 'Customer Transfer', color: 'blue' },
  { label: 'Bank Webhook', color: 'purple' },
  { label: 'Auto Matching', color: 'yellow' },
  { label: '1-Click Verify', color: 'green' },
  { label: 'Saldo Update', color: 'emerald' },
];

export const PLAN_C_FLOW: FlowStep[] = [
  { label: 'Customer Transfer', color: 'blue' },
  { label: 'Export Rekening Koran', color: 'purple' },
  { label: 'Upload ke IMPAZZ', color: 'green' },
  { label: 'Auto Matching', color: 'yellow' },
  { label: '1-Click Verify', color: 'emerald' },
];
