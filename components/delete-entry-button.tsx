'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteOvertimeEntry } from '@/lib/actions';
import { toast } from 'sonner';

export function DeleteEntryButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    startTransition(async () => {
      const result = await deleteOvertimeEntry(id);
      if (result.success) {
        toast.success('Entry deleted successfully');
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
