import { format, startOfDay } from 'date-fns';

import { getRollingTransactions } from '@/lib/data/transactions';
import { ReportsClient } from './_components/ReportsClient';

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  const referenceDate = startOfDay(new Date());
  const transactions = getRollingTransactions(referenceDate);
  const refreshedAt = format(new Date(transactions[0]?.transaction_date ?? referenceDate), "dd/MM/yyyy 'at' HH:mm");

  return (
    <ReportsClient
      transactions={transactions}
      referenceDateIso={referenceDate.toISOString()}
      refreshedAt={refreshedAt}
    />
  );
}
