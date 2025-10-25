'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format24to12, format12to24, isValid12HourTime } from '@/lib/time-format';

export interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value?: string; // Expects 24-hour format (HH:mm) from parent
  onChange?: (value: string) => void; // Returns 24-hour format (HH:mm) to parent
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, value, onChange, disabled, ...props }, ref) => {
    // Convert incoming 24-hour value to 12-hour for display
    const [timeValue, setTimeValue] = React.useState(() => {
      if (value && value.length === 5) {
        try {
          return format24to12(value);
        } catch {
          return '';
        }
      }
      return '';
    });

    React.useEffect(() => {
      if (value !== undefined) {
        if (value === '') {
          setTimeValue('');
        } else if (value.length === 5) {
          try {
            setTimeValue(format24to12(value));
          } catch {
            setTimeValue('');
          }
        }
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value.toUpperCase();

      // Allow only valid characters: digits, colon, space, A, M, P
      let inputValue = rawInput.replace(/[^0-9:APM\s]/g, '');

      // Auto-format as user types
      if (inputValue.length === 2 && !inputValue.includes(':') && /^\d{2}$/.test(inputValue)) {
        inputValue = inputValue + ':';
      }

      setTimeValue(inputValue);

      // Try to validate and convert complete time
      if (inputValue.trim() !== '') {
        try {
          // Check if it looks like a complete 12-hour time
          if (isValid12HourTime(inputValue)) {
            const time24 = format12to24(inputValue);
            onChange?.(time24);
          }
        } catch {
          // Not yet valid, continue typing
        }
      } else {
        onChange?.('');
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const val = e.target.value.trim().toUpperCase();

      // Auto-complete partial time on blur
      if (val.length > 0) {
        try {
          // Try to parse what we have
          let processedVal = val;

          // If no AM/PM specified, try to add it intelligently
          if (!val.includes('AM') && !val.includes('PM')) {
            // Default to AM for now, user can change
            processedVal = val + ' AM';
          }

          // Try to parse time part
          const timeMatch = processedVal.match(/^(\d{1,2}):?(\d{0,2})\s*(AM|PM)?$/);
          if (timeMatch) {
            let [, hours, minutes, period] = timeMatch;

            // Ensure minutes exist
            if (!minutes || minutes.length === 0) {
              minutes = '00';
            } else if (minutes.length === 1) {
              minutes = minutes + '0';
            }

            // Ensure period exists
            if (!period) {
              period = 'AM';
            }

            const formattedTime12 = `${hours}:${minutes} ${period}`;

            // Validate and convert
            if (isValid12HourTime(formattedTime12)) {
              const time24 = format12to24(formattedTime12);
              setTimeValue(formattedTime12);
              onChange?.(time24);
            }
          }
        } catch {
          // If parsing fails, keep the current value
        }
      }

      props.onBlur?.(e);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="text"
        placeholder="h:mm AM/PM"
        value={timeValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn('font-mono', className)}
        {...props}
      />
    );
  }
);

TimeInput.displayName = 'TimeInput';
