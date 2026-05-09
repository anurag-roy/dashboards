import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

import { DEFAULT_RANGE, RANGE_LABELS, type RangeKey } from './dateRanges';

type FilterDateProps = {
  range: RangeKey;
  onRangeChange: (value: RangeKey) => void;
};

const rangeItems = Object.entries(RANGE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function FilterDate({ range, onRangeChange }: FilterDateProps) {
  return (
    <div className='space-y-1.5'>
      <Label htmlFor='date-range' className='h-4 font-medium'>
        Date Range
      </Label>
      <Select
        value={range}
        items={rangeItems}
        onValueChange={(value) => {
          onRangeChange((value as RangeKey) ?? DEFAULT_RANGE);
        }}
      >
        <SelectTrigger id='date-range' className='w-full md:w-40'>
          <SelectValue placeholder='Select range' />
        </SelectTrigger>
        <SelectContent align='end'>
          {rangeItems.map((item) => (
            <SelectItem key={item.value} value={item.value} label={item.label}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
