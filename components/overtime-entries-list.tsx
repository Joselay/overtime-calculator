import { getOvertimeEntries } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteEntryButton } from './delete-entry-button';
import { format } from 'date-fns';

export async function OvertimeEntriesList() {
  const entries = await getOvertimeEntries();

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overtime Entries</CardTitle>
          <CardDescription>No overtime entries yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtime Entries</CardTitle>
        <CardDescription>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>OT Pay</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{entry.startTime}</TableCell>
                <TableCell>{entry.endTime}</TableCell>
                <TableCell>{entry.calculatedHours.toFixed(2)}h</TableCell>
                <TableCell>${entry.baseSalary.toFixed(2)}</TableCell>
                <TableCell className="font-semibold">
                  ${entry.overtimePay.toFixed(2)}
                </TableCell>
                <TableCell>
                  <DeleteEntryButton id={entry.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
