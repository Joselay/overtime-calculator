import { Suspense } from 'react';
import { OvertimeEntryForm } from '@/components/overtime-entry-form';
import { OvertimeEntriesList } from '@/components/overtime-entries-list';
import { OvertimeSummary } from '@/components/overtime-summary';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Overtime Calculator</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Track your overtime hours and calculate your pay
          </p>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <Suspense fallback={<SummarySkeleton />}>
            <OvertimeSummary />
          </Suspense>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <OvertimeEntryForm />
          </div>

          {/* Entries List Section */}
          <div className="lg:col-span-2">
            <Suspense fallback={<EntriesListSkeleton />}>
              <OvertimeEntriesList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 mt-2" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function EntriesListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
