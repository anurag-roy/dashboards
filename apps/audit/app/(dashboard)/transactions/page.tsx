'use client';

import { useState } from 'react';
import { type Row } from '@tanstack/react-table';

import { transactions } from '@/lib/data/transactions';
import { type Transaction } from '@/lib/data/schema';
import { DataTable } from './_components/DataTable';
import { DataTableDrawer } from './_components/DataTableDrawer';

export default function TransactionsPage() {
  const [selectedRow, setSelectedRow] = useState<Row<Transaction> | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-lg font-semibold text-foreground sm:text-xl'>Transactions</h1>
        <p className='text-sm text-muted-foreground'>
          Monitor expenses, update statuses, and keep audit context in one place.
        </p>
      </div>

      <DataTable
        data={transactions}
        onEditClick={(row) => {
          setSelectedRow(row);
          setDrawerOpen(true);
        }}
      />

      <DataTableDrawer row={selectedRow} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </section>
  );
}
