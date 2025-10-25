ALTER TABLE "users" ADD COLUMN "base_salary" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "overtime_entries" DROP COLUMN "base_salary";