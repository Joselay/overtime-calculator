'use client';

import { AnimatedNumber } from '@/components/ui/animated-number';
import { useState, useEffect } from 'react';

type SummaryNumbersProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function SummaryNumbers({ value, prefix, suffix, decimals }: SummaryNumbersProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const formattedValue = decimals !== undefined ? Number(value.toFixed(decimals)) : value;

  useEffect(() => {
    // Animate from 0 to the actual value on mount
    setDisplayValue(formattedValue);
  }, [formattedValue]);

  return (
    <span className="inline-flex items-center">
      {prefix && <span>{prefix}</span>}
      <AnimatedNumber value={displayValue} />
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
