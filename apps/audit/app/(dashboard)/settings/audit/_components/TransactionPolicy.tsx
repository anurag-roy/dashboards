'use client';

import { useState } from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { toast } from '@workspace/ui/components/sonner';

const keywordOptions = [
  { label: 'Coffee shop', flagged: 831, category: 'block' as const },
  { label: 'Club & bar', flagged: 213, category: 'block' as const },
  { label: 'Sports', flagged: 198, category: 'suspicious' as const },
  { label: 'Gambling', flagged: 172, category: 'block' as const },
  { label: 'Liquor', flagged: 121, category: 'suspicious' as const },
] as const;

const policyTypes = [
  {
    value: 'block',
    label: 'Block',
    description: 'Stops transactions before payment.',
  },
  {
    value: 'suspicious',
    label: 'Suspicious',
    description: 'Allows payment but flags for audit.',
  },
] as const;

const badgeVariantByCategory = {
  block: 'outline',
  suspicious: 'outline',
} as const;

type KeywordRule = {
  id: string;
  label: string;
  flagged: number;
  category: (typeof policyTypes)[number]['value'];
};

type OverviewItem = {
  label: string;
  count: number;
  volume: string;
  category: 'blocked' | 'suspicious' | 'successful';
};

const overviewStyles = {
  blocked: {
    marker: 'bg-destructive',
    bar: 'bg-destructive',
  },
  suspicious: {
    marker: 'bg-orange-500',
    bar: 'bg-orange-500',
  },
  successful: {
    marker: 'bg-muted-foreground',
    bar: 'bg-muted-foreground/70',
  },
} as const;

function titleCaseKeyword(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export default function TransactionPolicy() {
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [keywordPolicyType, setKeywordPolicyType] = useState<(typeof policyTypes)[number]['value']>(
    policyTypes[0].value
  );
  const [keywordRules, setKeywordRules] = useState<KeywordRule[]>(() =>
    keywordOptions.map((keyword) => ({ ...keyword, id: keyword.label }))
  );
  const [keywordValue, setKeywordValue] = useState('');

  const blockedCount =
    18 +
    keywordRules
      .filter((keyword) => keyword.category === 'block')
      .reduce((total, keyword) => total + keyword.flagged, 0);
  const suspiciousCount = keywordRules
    .filter((keyword) => keyword.category === 'suspicious')
    .reduce((total, keyword) => total + keyword.flagged, 0);
  const overview = [
    { label: 'Blocked transactions', count: blockedCount, volume: '$4,653', category: 'blocked' },
    { label: 'Suspicious transactions', count: suspiciousCount, volume: '$1,201', category: 'suspicious' },
    { label: 'Successful transactions', count: 10_546, volume: '$213,642', category: 'successful' },
  ] satisfies OverviewItem[];
  const transactionTotal = overview.reduce((total, item) => total + item.count, 0);

  function handleSaveKeyword() {
    const trimmedKeyword = keywordValue.trim();

    if (!trimmedKeyword) {
      toast.warning('Enter a keyword before saving.');
      return;
    }

    const nextKeyword = titleCaseKeyword(trimmedKeyword);
    const nextRule = {
      id: `${nextKeyword}-${Date.now()}`,
      label: nextKeyword,
      flagged: Math.max(24, nextKeyword.length * 17),
      category: keywordPolicyType,
    };

    setKeywordRules((current) => [nextRule, ...current]);
    setKeywordValue('');
    setShowAddKeyword(false);
    toast.success(`${nextKeyword} added as a ${keywordPolicyType} rule.`);
  }

  return (
    <section aria-labelledby='transaction-policy-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      <div>
        <h2 id='transaction-policy-heading' className='font-semibold text-foreground'>
          Transaction policy
        </h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          Block transactions by keyword or merchant category and route exceptions for audit.
        </p>
      </div>

      <div className='md:col-span-2'>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-5'>
            <h3 className='text-sm font-medium text-foreground'>Overview of blocked transactions</h3>
            <div className='flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted' aria-hidden='true'>
              {overview.map((item) => (
                <span
                  key={item.category}
                  className={overviewStyles[item.category].bar}
                  style={{ width: `${(item.count / transactionTotal) * 100}%` }}
                />
              ))}
            </div>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
              {overview.map((item) => (
                <div key={item.category} className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span className={`size-2.5 rounded-sm ${overviewStyles[item.category].marker}`} />
                    <span>{item.label}</span>
                  </div>
                  <p className='text-xl font-semibold text-foreground tabular-nums'>{item.count.toLocaleString()}</p>
                  <p className='text-sm text-muted-foreground'>{item.volume} volume</p>
                  <Button variant='link' size='sm' className='h-auto justify-start px-0 py-1 text-primary'>
                    Details
                    <ChevronRight className='size-4' aria-hidden='true' />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-[1fr_auto] gap-4 text-sm font-medium text-foreground'>
              <h3>Keyword / Merchant category</h3>
              <p># of transactions</p>
            </div>

            <div className='overflow-hidden rounded-3xl border border-border/70 bg-card px-4 sm:px-5'>
              {keywordRules.map((keyword, index) => (
                <div key={keyword.id}>
                  <div className='grid grid-cols-[1fr_auto] items-center gap-4 py-4'>
                    <Badge
                      variant={badgeVariantByCategory[keyword.category]}
                      className={
                        keyword.category === 'suspicious'
                          ? 'w-fit rounded-full border-orange-500/25 bg-orange-500/10 text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/15 dark:text-orange-300'
                          : 'w-fit rounded-full border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/15'
                      }
                    >
                      <span
                        className={`size-2 rounded-sm ${keyword.category === 'block' ? 'bg-destructive' : 'bg-orange-500'}`}
                        aria-hidden='true'
                      />
                      {keyword.label}
                    </Badge>
                    <div className='flex items-center gap-4'>
                      <span className='text-sm text-muted-foreground tabular-nums'>{keyword.flagged}</span>
                      <Separator orientation='vertical' className='h-5' />
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label={`Remove ${keyword.label}`}
                        onClick={() => {
                          setKeywordRules((current) => current.filter((rule) => rule.id !== keyword.id));
                          toast.success(`${keyword.label} removed from policy rules.`);
                        }}
                      >
                        <Trash2 className='size-4 text-muted-foreground' aria-hidden='true' />
                      </Button>
                    </div>
                  </div>
                  {index < keywordRules.length - 1 && <Separator />}
                </div>
              ))}
            </div>

            {showAddKeyword ? (
              <div className='grid grid-cols-1 gap-2 rounded-2xl border border-border/70 bg-muted/20 p-3 sm:grid-cols-[160px_1fr_auto_auto]'>
                <Select
                  value={keywordPolicyType}
                  items={policyTypes}
                  onValueChange={(value) => {
                    if (value) {
                      setKeywordPolicyType(value as (typeof policyTypes)[number]['value']);
                    }
                  }}
                >
                  <SelectTrigger aria-label='Policy type' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {policyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} label={type.label}>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`size-2 rounded-sm ${type.value === 'block' ? 'bg-destructive' : 'bg-orange-500'}`}
                            aria-hidden='true'
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={keywordValue}
                  onChange={(event) => setKeywordValue(event.target.value)}
                  placeholder='Insert keyword'
                  aria-label='Keyword or merchant category'
                />
                <Button
                  variant='secondary'
                  onClick={() => {
                    setKeywordValue('');
                    setShowAddKeyword(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveKeyword} disabled={!keywordValue.trim()}>
                  Save
                </Button>
              </div>
            ) : (
              <div className='flex justify-start sm:justify-end'>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setShowAddKeyword(true);
                  }}
                >
                  Add keyword
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
