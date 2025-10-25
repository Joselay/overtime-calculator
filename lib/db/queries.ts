import { db } from './index';
import { overtimeEntries } from './schema';
import { sql } from 'drizzle-orm';

export interface OvertimeStats {
  totalOvertimePay: number;
  totalHours: number;
  totalEntries: number;
  averageOvertimePay: number;
  previousMonthTotalPay: number;
  previousMonthTotalHours: number;
}

export async function getOvertimeStats(): Promise<OvertimeStats> {
  // Get current month stats
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const currentMonthEnd = new Date();
  currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
  currentMonthEnd.setDate(0);
  currentMonthEnd.setHours(23, 59, 59, 999);

  // Get previous month stats
  const previousMonthStart = new Date();
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);
  previousMonthStart.setHours(0, 0, 0, 0);

  const previousMonthEnd = new Date();
  previousMonthEnd.setDate(0);
  previousMonthEnd.setHours(23, 59, 59, 999);

  const [currentMonthData] = await db
    .select({
      totalOvertimePay: sql<number>`COALESCE(SUM(${overtimeEntries.overtimePay}), 0)`,
      totalHours: sql<number>`COALESCE(SUM(${overtimeEntries.calculatedHours}), 0)`,
      totalEntries: sql<number>`COALESCE(COUNT(*), 0)`,
      averageOvertimePay: sql<number>`COALESCE(AVG(${overtimeEntries.overtimePay}), 0)`,
    })
    .from(overtimeEntries)
    .where(
      sql`${overtimeEntries.date} >= ${currentMonthStart.toISOString().split('T')[0]}
          AND ${overtimeEntries.date} <= ${currentMonthEnd.toISOString().split('T')[0]}`
    );

  const [previousMonthData] = await db
    .select({
      totalOvertimePay: sql<number>`COALESCE(SUM(${overtimeEntries.overtimePay}), 0)`,
      totalHours: sql<number>`COALESCE(SUM(${overtimeEntries.calculatedHours}), 0)`,
    })
    .from(overtimeEntries)
    .where(
      sql`${overtimeEntries.date} >= ${previousMonthStart.toISOString().split('T')[0]}
          AND ${overtimeEntries.date} <= ${previousMonthEnd.toISOString().split('T')[0]}`
    );

  return {
    totalOvertimePay: Number(currentMonthData?.totalOvertimePay) || 0,
    totalHours: Number(currentMonthData?.totalHours) || 0,
    totalEntries: Number(currentMonthData?.totalEntries) || 0,
    averageOvertimePay: Number(currentMonthData?.averageOvertimePay) || 0,
    previousMonthTotalPay: Number(previousMonthData?.totalOvertimePay) || 0,
    previousMonthTotalHours: Number(previousMonthData?.totalHours) || 0,
  };
}

export interface OvertimeChartData {
  date: string;
  hours: number;
  pay: number;
}

export async function getOvertimeChartData(): Promise<OvertimeChartData[]> {
  // Get data for the last 90 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  const results = await db
    .select({
      date: overtimeEntries.date,
      hours: sql<number>`COALESCE(SUM(${overtimeEntries.calculatedHours}), 0)`,
      pay: sql<number>`COALESCE(SUM(${overtimeEntries.overtimePay}), 0)`,
    })
    .from(overtimeEntries)
    .where(
      sql`${overtimeEntries.date} >= ${startDate.toISOString().split('T')[0]}
          AND ${overtimeEntries.date} <= ${endDate.toISOString().split('T')[0]}`
    )
    .groupBy(overtimeEntries.date)
    .orderBy(overtimeEntries.date);

  return results.map((row) => ({
    date: row.date,
    hours: Number(row.hours) || 0,
    pay: Number(row.pay) || 0,
  }));
}
