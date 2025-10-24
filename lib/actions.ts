'use server';

import { db } from '@/lib/db';
import { overtimeEntries } from '@/lib/db/schema';
import { calculateDuration, calculateOvertimePay } from '@/lib/overtime-calculations';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addOvertimeEntry(formData: FormData) {
  const date = formData.get('date') as string;
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const baseSalary = parseFloat(formData.get('baseSalary') as string);

  // Calculate duration and overtime pay
  const calculatedHours = calculateDuration(startTime, endTime);
  const overtimePay = calculateOvertimePay(baseSalary, calculatedHours);

  // Insert into database
  await db.insert(overtimeEntries).values({
    date,
    startTime,
    endTime,
    baseSalary,
    calculatedHours,
    overtimePay,
  });

  revalidatePath('/');
  return { success: true };
}

export async function getOvertimeEntries() {
  const entries = await db
    .select()
    .from(overtimeEntries)
    .orderBy(desc(overtimeEntries.date), desc(overtimeEntries.createdAt));

  return entries;
}

export async function deleteOvertimeEntry(id: number) {
  await db.delete(overtimeEntries).where(eq(overtimeEntries.id, id));

  revalidatePath('/');
  return { success: true };
}

export async function getOvertimeSummary() {
  const entries = await getOvertimeEntries();

  const totalHours = entries.reduce((sum, entry) => sum + entry.calculatedHours, 0);
  const totalPay = entries.reduce((sum, entry) => sum + entry.overtimePay, 0);

  return {
    totalHours: parseFloat(totalHours.toFixed(2)),
    totalPay: parseFloat(totalPay.toFixed(2)),
    entryCount: entries.length,
  };
}
