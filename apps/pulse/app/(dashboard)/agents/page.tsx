import { Separator } from '@workspace/ui/components/separator';

import { agents } from '@/lib/data/agents/agents';
import { DataTable } from './_components/DataTable';

export default function AgentsPage() {
  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>Agents</h1>
          <p className='text-sm text-muted-foreground sm:text-sm/6'>
            Monitor agent performance and manage ticket generation
          </p>
        </div>
      </div>

      <Separator className='mt-6' />

      <section className='mt-8'>
        <DataTable data={agents} />
      </section>
    </main>
  );
}
