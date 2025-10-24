/**
 * Overtime calculation utilities
 * Following EXACT logic from my-salary project
 */

/**
 * Calculate duration in hours between start and end time
 * @param startTime - Format: "HH:mm" (e.g., "09:00")
 * @param endTime - Format: "HH:mm" (e.g., "18:00")
 * @returns Duration in hours (e.g., 9.0)
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  let durationInMinutes = endInMinutes - startInMinutes;

  // Handle case where end time is past midnight (e.g., 23:00 to 02:00)
  if (durationInMinutes < 0) {
    durationInMinutes += 24 * 60;
  }

  return durationInMinutes / 60;
}

/**
 * Calculate overtime pay using EXACT formula from my-salary project
 * Formula: salary / 22 / 8 * 1.5 * overtimeHours
 *
 * @param salary - Monthly base salary
 * @param overtimeHours - Number of overtime hours worked
 * @returns Overtime pay amount
 */
export function calculateOvertimePay(salary: number, overtimeHours: number): number {
  // EXACT formula from my-salary project - DO NOT CHANGE
  const dailyRate = salary / 22;           // 22 working days per month
  const hourlyRate = dailyRate / 8;        // 8 hours per working day
  const overtimeRate = hourlyRate * 1.5;   // 1.5x multiplier for overtime
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
