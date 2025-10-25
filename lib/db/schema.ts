import { pgTable, serial, text, real, timestamp, date, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email'),
  avatar: text('avatar'),
  password: text('password').notNull(),
  baseSalary: real('base_salary').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const overtimeEntries = pgTable('overtime_entries', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  startTime: text('start_time').notNull(), // Format: HH:mm
  endTime: text('end_time').notNull(), // Format: HH:mm
  calculatedHours: real('calculated_hours').notNull(),
  overtimePay: real('overtime_pay').notNull(),
  task: text('task').notNull(),
  project: text('project').notNull(),
  isPublicHoliday: boolean('is_public_holiday').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OvertimeEntry = typeof overtimeEntries.$inferSelect;
export type NewOvertimeEntry = typeof overtimeEntries.$inferInsert;
