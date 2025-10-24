import { getOvertimeSummary } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryNumbers } from './summary-numbers';

export async function OvertimeSummary() {
  const summary = await getOvertimeSummary();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Total Entries</CardDescription>
          <CardTitle className="text-3xl">
            <SummaryNumbers value={summary.entryCount} />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Hours</CardDescription>
          <CardTitle className="text-3xl">
            <SummaryNumbers value={summary.totalHours} suffix="h" />
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Overtime Pay</CardDescription>
          <CardTitle className="text-3xl">
            <SummaryNumbers value={summary.totalPay} prefix="$" decimals={2} />
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
