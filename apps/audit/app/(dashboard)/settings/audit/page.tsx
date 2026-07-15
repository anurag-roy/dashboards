import { Separator } from '@workspace/ui/components/separator';

import Approvers from './_components/Approvers';
import AuditRules from './_components/AuditRules';
import TransactionPolicy from './_components/TransactionPolicy';

export default function AuditPage() {
  return (
    <div className='space-y-8'>
      <AuditRules />
      <Separator />
      <Approvers />
      <Separator />
      <TransactionPolicy />
    </div>
  );
}
