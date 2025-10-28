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
 * Calculate overtime pay with flat 150% rate
 * All overtime hours are calculated at 150% (1.5x) rate regardless of timing or day.
 *
 * Formula: salary / 22 / 8 * 1.5 * overtimeHours
 *
 * @param salary - Monthly base salary
 * @param overtimeHours - Number of overtime hours worked
 * @returns Overtime pay amount
 */
export function calculateOvertimePay(
  salary: number,
  overtimeHours: number
): number {
  const dailyRate = salary / 22;           // 22 working days per month
  const hourlyRate = dailyRate / 8;        // 8 hours per working day

  // Flat 150% rate for all overtime
  const multiplier = 1.5;

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
