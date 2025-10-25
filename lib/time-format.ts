/**
 * Utility functions for converting between 24-hour and 12-hour time formats
 */

/**
 * Converts 24-hour format (HH:mm) to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "14:30")
 * @returns Time in 12-hour format with AM/PM (e.g., "2:30 PM")
 */
export function format24to12(time24: string): string {
  const [hours24Str, minutes] = time24.split(':');
  const hours24 = parseInt(hours24Str, 10);

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12; // Convert 0 to 12 for midnight

  return `${hours12}:${minutes} ${period}`;
}

/**
 * Converts 12-hour format with AM/PM to 24-hour format (HH:mm)
 * @param time12 - Time in 12-hour format (e.g., "2:30 PM" or "2:30PM")
 * @returns Time in 24-hour format (e.g., "14:30")
 */
export function format12to24(time12: string): string {
  // Remove extra spaces and normalize
  const normalized = time12.trim().toUpperCase();

  // Match pattern like "2:30 PM" or "2:30PM"
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) {
    throw new Error('Invalid time format. Expected format: HH:mm AM/PM');
  }

  const [, hours12Str, minutes, period] = match;
  let hours24 = parseInt(hours12Str, 10);

  // Validate hours and minutes
  if (hours24 < 1 || hours24 > 12) {
    throw new Error('Hours must be between 1 and 12');
  }

  const minutesNum = parseInt(minutes, 10);
  if (minutesNum < 0 || minutesNum > 59) {
    throw new Error('Minutes must be between 00 and 59');
  }

  // Convert to 24-hour format
  if (period === 'AM') {
    if (hours24 === 12) {
      hours24 = 0; // Midnight
    }
  } else { // PM
    if (hours24 !== 12) {
      hours24 += 12;
    }
  }

  // Pad with zeros
  const hours24Str = hours24.toString().padStart(2, '0');

  return `${hours24Str}:${minutes}`;
}

/**
 * Validates 12-hour time format with AM/PM
 * @param time - Time string to validate
 * @returns true if valid, false otherwise
 */
export function isValid12HourTime(time: string): boolean {
  const pattern = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s*(AM|PM)$/i;
  return pattern.test(time.trim());
}
