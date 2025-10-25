"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeInput } from "@/components/ui/time-input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateOvertimeEntry } from "@/lib/actions";
import { calculateDuration } from "@/lib/overtime-calculations";
import { format, parse } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";

interface EditOvertimeDialogProps {
  entry: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    calculatedHours: number;
    overtimePay: number;
    task: string;
    project: string;
    isPublicHoliday: boolean;
    createdAt?: Date;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOvertimeDialog({
  entry,
  open,
  onOpenChange,
}: EditOvertimeDialogProps) {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPublicHoliday, setIsPublicHoliday] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Calculate duration in real-time (auto-detects overnight)
  const calculatedHours = startTime && endTime
    ? calculateDuration(startTime, endTime)
    : 0;

  // Initialize form with entry data when dialog opens
  useEffect(() => {
    if (open && entry) {
      setDate(parse(entry.date, "yyyy-MM-dd", new Date()));
      setStartTime(entry.startTime);
      setEndTime(entry.endTime);
      setIsPublicHoliday(entry.isPublicHoliday || false);
    }
  }, [open, entry]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Please enter start and end times (e.g., 9:00 AM)");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("date", format(date, "yyyy-MM-dd"));
    formData.set("startTime", startTime);
    formData.set("endTime", endTime);
    formData.set("isPublicHoliday", String(isPublicHoliday));

    startTransition(async () => {
      const result = await updateOvertimeEntry(entry.id, formData);
      if (result.success) {
        toast.success("Overtime entry updated successfully");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Overtime Entry</DialogTitle>
          <DialogDescription>
            Update the date, task, project, start time, and end time
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
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
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
              defaultValue={entry.task}
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
              defaultValue={entry.project}
              required
              disabled={isPending}
            />
          </div>

          {/* Public Holiday Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublicHoliday"
              checked={isPublicHoliday}
              onCheckedChange={(checked) => setIsPublicHoliday(checked === true)}
              disabled={isPending}
            />
            <Label
              htmlFor="isPublicHoliday"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Public Holiday (200% rate)
            </Label>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
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
            <Label htmlFor="endTime">End Time</Label>
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

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Updating..." : "Update Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
