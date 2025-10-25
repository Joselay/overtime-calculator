'use server';

import { db } from '@/lib/db';
import { overtimeEntries } from '@/lib/db/schema';
import { calculateDuration, calculateOvertimePay } from '@/lib/overtime-calculations';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function addOvertimeEntry(formData: FormData) {
  // Get current user to retrieve their base salary
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const date = formData.get('date') as string;
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const task = formData.get('task') as string;
  const project = formData.get('project') as string;

  // Calculate duration and overtime pay using user's base salary
  // Automatically detects overnight shifts (e.g., 18:00 to 02:00 = 8 hours)
  const calculatedHours = calculateDuration(startTime, endTime);
  const overtimePay = calculateOvertimePay(currentUser.baseSalary, calculatedHours);

  // Insert into database
  await db.insert(overtimeEntries).values({
    date,
    startTime,
    endTime,
    calculatedHours,
    overtimePay,
    task,
    project,
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

export async function updateOvertimeEntry(id: number, formData: FormData) {
  // Get current user to retrieve their base salary
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const date = formData.get('date') as string;
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const task = formData.get('task') as string;
  const project = formData.get('project') as string;

  // Calculate duration and overtime pay using user's base salary
  // Automatically detects overnight shifts (e.g., 18:00 to 02:00 = 8 hours)
  const calculatedHours = calculateDuration(startTime, endTime);
  const overtimePay = calculateOvertimePay(currentUser.baseSalary, calculatedHours);

  // Update in database
  await db
    .update(overtimeEntries)
    .set({
      date,
      startTime,
      endTime,
      calculatedHours,
      overtimePay,
      task,
      project,
    })
    .where(eq(overtimeEntries.id, id));

  revalidatePath('/');
  return { success: true };
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
