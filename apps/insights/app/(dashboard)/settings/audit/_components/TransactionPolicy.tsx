'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

const overview = [
  { label: 'Blocked transactions', count: 1234, volume: '$4,653', variant: 'error' as const },
  { label: 'Suspicious transactions', count: 319, volume: '$1,201', variant: 'warning' as const },
  { label: 'Successful transactions', count: 10_546, volume: '$213,642', variant: 'neutral' as const },
] as const;

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
  block: 'error',
  suspicious: 'warning',
} as const;

export default function TransactionPolicy() {
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [keywordPolicyType, setKeywordPolicyType] = useState<(typeof policyTypes)[number]['value']>(
    policyTypes[0].value
  );

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

      <div className='space-y-6 md:col-span-2'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          {overview.map((item) => (
            <Card key={item.label} className='rounded-2xl'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-xs font-medium text-muted-foreground'>{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-row flex-wrap items-baseline gap-x-2 gap-y-1'>
                  <p className='text-2xl font-semibold text-foreground tabular-nums'>{item.count.toLocaleString()}</p>
                  <InsightBadge variant={item.variant} className='shrink-0'>
                    {item.volume} volume
                  </InsightBadge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm'>Keyword / merchant category rules</CardTitle>
          </CardHeader>
          <CardContent className='space-y-1'>
            {keywordOptions.map((keyword) => (
              <div
                key={keyword.label}
                className='flex items-center justify-between gap-3 rounded-2xl px-2 py-2 hover:bg-muted/40'
              >
                <InsightBadge variant={badgeVariantByCategory[keyword.category]}>{keyword.label}</InsightBadge>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground tabular-nums'>{keyword.flagged}</span>
                  <Button variant='ghost' size='icon-sm' aria-label={`Remove ${keyword.label}`}>
                    <Trash2 className='size-4 text-muted-foreground' />
                  </Button>
                </div>
              </div>
            ))}

            {showAddKeyword && (
              <div className='mt-3 rounded-2xl border border-border/70 bg-muted/20 p-3'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr]'>
                  <div className='space-y-2'>
                    <Label htmlFor='policy-type'>Policy</Label>
                    <Select
                      value={keywordPolicyType}
                      items={policyTypes}
                      onValueChange={(value) => {
                        if (value) {
                          setKeywordPolicyType(value as (typeof policyTypes)[number]['value']);
                        }
                      }}
                    >
                      <SelectTrigger id='policy-type' className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align='start'>
                        {policyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} label={type.label}>
                            <div className='space-y-0.5'>
                              <p>{type.label}</p>
                              <p className='text-xs font-normal text-muted-foreground'>{type.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='keyword-input'>Keyword</Label>
                    <Input id='keyword-input' placeholder='Insert keyword or merchant category' />
                  </div>
                </div>
                <div className='mt-3 flex justify-end gap-2'>
                  <Button variant='secondary' onClick={() => setShowAddKeyword(false)}>
                    Cancel
                  </Button>
                  <Button>Save keyword</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!showAddKeyword && (
          <div className='flex justify-start sm:justify-end'>
            <Button variant='secondary' onClick={() => setShowAddKeyword(true)}>
              Add keyword
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
