CREATE TABLE "overtime_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"base_salary" real NOT NULL,
	"calculated_hours" real NOT NULL,
	"overtime_pay" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
