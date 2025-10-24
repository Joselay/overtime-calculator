import { pgTable, serial, text, real, timestamp, date } from 'drizzle-orm/pg-core';

export const overtimeEntries = pgTable('overtime_entries', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  startTime: text('start_time').notNull(), // Format: HH:mm
  endTime: text('end_time').notNull(), // Format: HH:mm
  baseSalary: real('base_salary').notNull(),
  calculatedHours: real('calculated_hours').notNull(),
  overtimePay: real('overtime_pay').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type OvertimeEntry = typeof overtimeEntries.$inferSelect;
export type NewOvertimeEntry = typeof overtimeEntries.$inferInsert;
