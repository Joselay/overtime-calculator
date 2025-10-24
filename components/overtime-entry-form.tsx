'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addOvertimeEntry } from '@/lib/actions';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

export function OvertimeEntryForm() {
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
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Overtime Entry</CardTitle>
        <CardDescription>
          Enter the date, start time, end time, and your base salary
        </CardDescription>
      </CardHeader>
      <CardContent>
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

          {/* Base Salary */}
          <div className="space-y-2">
            <Label htmlFor="baseSalary">Base Salary (Monthly)</Label>
            <Input
              type="number"
              id="baseSalary"
              name="baseSalary"
              placeholder="3000"
              step="0.01"
              min="0"
              required
              disabled={isPending}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
