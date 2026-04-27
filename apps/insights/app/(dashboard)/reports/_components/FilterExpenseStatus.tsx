import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

import { expenseStatuses } from '@/lib/data/schema';

type FilterExpenseStatusProps = {
  status: 'all' | (typeof expenseStatuses)[number]['value'];
  onStatusChange: (value: 'all' | (typeof expenseStatuses)[number]['value']) => void;
};

const statusItems = [
  { value: 'all', label: 'All statuses' },
  ...expenseStatuses.map((status) => ({
    value: status.value,
    label: status.label,
  })),
];

export function FilterExpenseStatus({ status, onStatusChange }: FilterExpenseStatusProps) {
  return (
    <div className='space-y-1.5'>
      <Label htmlFor='expense-filter' className='h-4 font-medium'>
        Expense Status
      </Label>
      <Select
        value={status}
        items={statusItems}
        onValueChange={(value) => {
          onStatusChange((value as FilterExpenseStatusProps['status']) ?? 'all');
        }}
      >
        <SelectTrigger id='expense-filter' className='w-full md:w-44'>
          <SelectValue placeholder='Select status' />
        </SelectTrigger>
        <SelectContent align='end'>
          <SelectItem value='all' label='All statuses'>
            All statuses
          </SelectItem>
          {expenseStatuses.map((item) => (
            <SelectItem key={item.value} value={item.value} label={item.label}>
              <InsightBadge variant={item.variant} className='w-fit shrink-0'>
                {item.label}
              </InsightBadge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
