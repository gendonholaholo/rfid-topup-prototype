import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
  hasFilter: boolean;
  children?: React.ReactNode;
}

export function DateFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onReset,
  hasFilter,
  children,
}: DateFilterProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Dari</label>
            <Input
              type="date"
              className="w-auto"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Sampai</label>
            <Input
              type="date"
              className="w-auto"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
          {children}
          {hasFilter && (
            <Button variant="outline" onClick={onReset}>
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
