/**
 * Overtime calculation utilities
 * Following EXACT logic from my-salary project
 */

/**
 * Calculate duration in hours between start and end time
 * Automatically detects overnight shifts when end time < start time
 * @param startTime - Format: "HH:mm" (e.g., "18:00")
 * @param endTime - Format: "HH:mm" (e.g., "02:00")
 * @returns Duration in hours (e.g., 8.0 for 18:00 to 02:00)
 */
export function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  let durationInMinutes = endInMinutes - startInMinutes;

  // Auto-detect overnight: if end time is before start time, add 24 hours
  if (durationInMinutes < 0) {
    durationInMinutes += 24 * 60;
  }

  return durationInMinutes / 60;
}

/**
 * Check if a date falls on a weekend (Saturday or Sunday)
 * @param date - Date string in format "YYYY-MM-DD"
 * @returns true if the date is Saturday or Sunday
 */
export function isWeekend(date: string): boolean {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if the work period includes night hours (10pm to 5am)
 * @param startTime - Format: "HH:mm" (e.g., "18:00")
 * @param endTime - Format: "HH:mm" (e.g., "02:00")
 * @returns true if any part of the work period falls between 22:00 and 05:00
 */
export function isNightWork(startTime: string, endTime: string): boolean {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  const nightStart = 22 * 60; // 10pm in minutes
  const nightEnd = 5 * 60;    // 5am in minutes

  // Handle overnight shifts
  if (endInMinutes < startInMinutes) {
    // Overnight shift: check if it crosses into night hours
    // Night work if: starts at or after 10pm, OR ends at or before 5am
    return startInMinutes >= nightStart || endInMinutes <= nightEnd;
  } else {
    // Same-day shift: check if it overlaps with night hours
    // Night work if: starts at or after 10pm, OR (starts before 5am AND ends after start)
    return startInMinutes >= nightStart || (startInMinutes < nightEnd && endInMinutes > startInMinutes);
  }
}

/**
 * Calculate overtime pay with tiered rates based on work conditions
 * - Daytime work on normal working day: 150% (1.5x)
 * - Night work (10pm-5am) OR weekend OR public holiday: 200% (2.0x)
 *
 * Formula: salary / 22 / 8 * multiplier * overtimeHours
 *
 * @param salary - Monthly base salary
 * @param overtimeHours - Number of overtime hours worked
 * @param date - Date of work in format "YYYY-MM-DD"
 * @param startTime - Start time in format "HH:mm"
 * @param endTime - End time in format "HH:mm"
 * @param isPublicHoliday - Whether the work day is a public holiday (default: false)
 * @returns Overtime pay amount
 */
export function calculateOvertimePay(
  salary: number,
  overtimeHours: number,
  date: string,
  startTime: string,
  endTime: string,
  isPublicHoliday: boolean = false
): number {
  const dailyRate = salary / 22;           // 22 working days per month
  const hourlyRate = dailyRate / 8;        // 8 hours per working day

  // Determine multiplier based on work conditions
  const isWeekendWork = isWeekend(date);
  const isNightShift = isNightWork(startTime, endTime);

  // 200% rate for night work, weekend work, or public holiday; otherwise 150%
  const multiplier = (isWeekendWork || isNightShift || isPublicHoliday) ? 2.0 : 1.5;

  const overtimeRate = hourlyRate * multiplier;
  const otPay = overtimeRate * overtimeHours;

  return parseFloat(otPay.toFixed(2));
}

/**
 * Calculate gross salary (base + overtime)
 * @param salary - Monthly base salary
 * @param overtimePay - Calculated overtime pay
 * @returns Total gross salary
 */
export function calculateGrossSalary(salary: number, overtimePay: number): number {
  return parseFloat((salary + overtimePay).toFixed(2));
}
