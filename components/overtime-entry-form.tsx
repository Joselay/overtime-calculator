'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TimeInput } from '@/components/ui/time-input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addOvertimeEntry } from '@/lib/actions';
import { calculateDuration } from '@/lib/overtime-calculations';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function OvertimeEntryForm() {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Calculate duration in real-time (auto-detects overnight)
  const calculatedHours = startTime && endTime
    ? calculateDuration(startTime, endTime)
    : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    if (!startTime || !endTime) {
      toast.error('Please enter start and end times in 24-hour format (HH:mm)');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('date', format(date, 'yyyy-MM-dd'));
    formData.set('startTime', startTime);
    formData.set('endTime', endTime);

    startTransition(async () => {
      const result = await addOvertimeEntry(formData);
      if (result.success) {
        toast.success('Overtime entry added successfully');
        // Reset form
        formRef.current?.reset();
        setDate(undefined);
        setStartTime('');
        setEndTime('');
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
            <Label htmlFor="startTime">Start Time (24-hour format)</Label>
            <TimeInput
              id="startTime"
              name="startTime"
              value={startTime}
              onChange={setStartTime}
              required
              disabled={isPending}
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time (24-hour format)</Label>
            <TimeInput
              id="endTime"
              name="endTime"
              value={endTime}
              onChange={setEndTime}
              required
              disabled={isPending}
            />
          </div>

          {/* Duration Display */}
          {startTime && endTime && calculatedHours > 0 && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Total: {calculatedHours.toFixed(1)} hours
              </span>
            </div>
          )}

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
