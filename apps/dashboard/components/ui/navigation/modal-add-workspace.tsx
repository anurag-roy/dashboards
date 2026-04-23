'use client';

import { databases } from '@/components/ui/navigation/workspace-database-options';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import * as React from 'react';

export type ModalAddWorkspaceProps = {
  itemName: string;
  onSelect: () => void;
  onOpenChange: (open: boolean) => void;
};

const starterKitOptions = [
  { value: 'empty-workspace', label: 'None - Empty workspace' },
  { value: 'commerce-analytics', label: 'Commerce analytics' },
  { value: 'product-analytics', label: 'Product analytics' },
] as const;

const databaseRegionOptions = [
  { value: 'europe-west-01', label: 'europe-west-01' },
  { value: 'us-east-02', label: 'us-east-02' },
  { value: 'us-west-01', label: 'us-west-01' },
] as const;

export function ModalAddWorkspace({ itemName, onSelect, onOpenChange }: ModalAddWorkspaceProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
  };

  return (
    <>
      <DropdownMenuItem
        closeOnClick={false}
        onClick={(e) => {
          e.preventDefault();
          onSelect();
          handleOpenChange(true);
        }}
      >
        {itemName}
      </DropdownMenuItem>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-2xl' showCloseButton>
          <form>
            <DialogHeader>
              <DialogTitle>Add new workspace</DialogTitle>
              <DialogDescription className='mt-1 text-sm leading-6'>
                With free plan, you can add up to 10 workspaces.
              </DialogDescription>
              <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='min-w-0'>
                  <Label htmlFor='workspace-name' className='font-medium'>
                    Workspace name
                  </Label>
                  <Input id='workspace-name' name='workspace-name' placeholder='my_workspace' className='mt-2' />
                </div>
                <div className='min-w-0'>
                  <Label htmlFor='starter-kit' className='font-medium'>
                    Starter kit
                  </Label>
                  <Select defaultValue='empty-workspace' items={starterKitOptions}>
                    <SelectTrigger id='starter-kit' name='starter-kit' className='mt-2 w-full'>
                      <SelectValue className='truncate' />
                    </SelectTrigger>
                    <SelectContent>
                      {starterKitOptions.map((starterKitOption) => (
                        <SelectItem key={starterKitOption.value} value={starterKitOption.value}>
                          {starterKitOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='col-span-full'>
                  <Label htmlFor='database-region' className='font-medium'>
                    Database region
                  </Label>
                  <Select defaultValue='europe-west-01' items={databaseRegionOptions}>
                    <SelectTrigger id='database-region' name='database-region' className='mt-2 w-full'>
                      <SelectValue className='truncate' />
                    </SelectTrigger>
                    <SelectContent>
                      {databaseRegionOptions.map((databaseRegionOption) => (
                        <SelectItem key={databaseRegionOption.value} value={databaseRegionOption.value}>
                          {databaseRegionOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='mt-2 text-xs text-muted-foreground'>
                    For best performance, choose a region closest to your application.
                  </p>
                </div>
              </div>
              <div className='mt-4'>
                <Label className='font-medium'>Database configuration</Label>
                <fieldset className='mt-2 grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
                  {databases.map((database) => (
                    <label
                      key={database.value}
                      className='flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 ring-1 ring-transparent has-checked:border-primary has-checked:ring-primary/20'
                    >
                      <input
                        type='radio'
                        name='database-config'
                        value={database.value}
                        defaultChecked={database.isRecommended}
                        className='mt-1 size-4 accent-primary'
                      />
                      <div>
                        {database.isRecommended ? (
                          <div className='flex items-center gap-2'>
                            <span className='leading-5'>{database.label}</span>
                            <Badge>Recommended</Badge>
                          </div>
                        ) : (
                          <span>{database.label}</span>
                        )}
                        <p className='mt-1 text-xs text-muted-foreground'>{database.description}</p>
                      </div>
                    </label>
                  ))}
                </fieldset>
              </div>
            </DialogHeader>
            <DialogFooter className='mt-6'>
              <Button
                className='mt-2 w-full sm:mt-0 sm:w-fit'
                variant='secondary'
                type='button'
                onClick={() => handleOpenChange(false)}
              >
                Go back
              </Button>
              <Button type='submit' className='w-full sm:w-fit'>
                Add workspace
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
