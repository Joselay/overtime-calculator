'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, value, onChange, disabled, ...props }, ref) => {
    const [timeValue, setTimeValue] = React.useState(value || '');

    React.useEffect(() => {
      if (value !== undefined) {
        setTimeValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value.replace(/[^0-9:]/g, '');

      // Auto-format as user types
      if (inputValue.length === 2 && !inputValue.includes(':')) {
        inputValue = inputValue + ':';
      }

      // Limit to HH:mm format
      if (inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5);
      }

      setTimeValue(inputValue);

      // Validate and call onChange when complete
      if (inputValue.length === 5 && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue)) {
        onChange?.(inputValue);
      } else if (inputValue === '') {
        onChange?.('');
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const val = e.target.value;

      // Auto-complete partial time on blur
      if (val.length > 0 && val.length < 5) {
        let [hours, minutes] = val.split(':');

        if (hours && hours.length === 1) {
          hours = '0' + hours;
        }
        if (!minutes) {
          minutes = '00';
        } else if (minutes.length === 1) {
          minutes = minutes + '0';
        }

        const formattedTime = `${hours}:${minutes}`;

        // Validate the formatted time
        if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formattedTime)) {
          setTimeValue(formattedTime);
          onChange?.(formattedTime);
        }
      }

      props.onBlur?.(e);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="HH:mm (24-hour)"
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
