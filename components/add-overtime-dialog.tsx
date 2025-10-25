'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addOvertimeEntry } from '@/lib/actions';
import { format } from 'date-fns';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

export function AddOvertimeDialog() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('date', format(date, 'yyyy-MM-dd'));

    startTransition(async () => {
      const result = await addOvertimeEntry(formData);
      if (result.success) {
        toast.success('Overtime entry added successfully');
        // Reset form
        formRef.current?.reset();
        setDate(undefined);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="size-4" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Overtime Entry</DialogTitle>
          <DialogDescription>
            Enter the date, task, project, start time, and end time
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Task */}
          <div className="space-y-2">
            <Label htmlFor="task">Task</Label>
            <Input
              type="text"
              id="task"
              name="task"
              placeholder="What task were you working on?"
              required
              disabled={isPending}
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Input
              type="text"
              id="project"
              name="project"
              placeholder="What project is this for?"
              required
              disabled={isPending}
            />
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              type="time"
              id="startTime"
              name="startTime"
              required
              disabled={isPending}
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              type="time"
              id="endTime"
              name="endTime"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
