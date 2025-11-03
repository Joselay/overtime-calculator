import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  stats: {
    totalOvertimePay: number
    totalHours: number
    totalEntries: number
    averageOvertimePay: number
    currentMonthTotalPay: number
    currentMonthTotalHours: number
    previousMonthTotalPay: number
    previousMonthTotalHours: number
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  // Calculate percentage changes (current month vs previous month)
  const payChangePercent = stats.previousMonthTotalPay > 0
    ? ((stats.currentMonthTotalPay - stats.previousMonthTotalPay) / stats.previousMonthTotalPay * 100)
    : 0

  const hoursChangePercent = stats.previousMonthTotalHours > 0
    ? ((stats.currentMonthTotalHours - stats.previousMonthTotalHours) / stats.previousMonthTotalHours * 100)
    : 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatHours = (value: number) => {
    return value.toFixed(1)
  }

  const formatPercent = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Overtime Pay</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.totalOvertimePay)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {payChangePercent >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {formatPercent(payChangePercent)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {payChangePercent >= 0 ? 'Increased' : 'Decreased'} from last month{' '}
            {payChangePercent >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Total overtime earnings (all-time)
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Overtime Hours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatHours(stats.totalHours)}h
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {hoursChangePercent >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {formatPercent(hoursChangePercent)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {hoursChangePercent >= 0 ? 'More' : 'Less'} hours than last month{' '}
            {hoursChangePercent >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Total hours worked overtime (all-time)
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overtime Entries</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalEntries}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              This month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total overtime sessions (all-time)
          </div>
          <div className="text-muted-foreground">Number of all overtime entries</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Pay Per Entry</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(stats.averageOvertimePay)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Average
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mean overtime compensation (all-time)
          </div>
          <div className="text-muted-foreground">Average per overtime session</div>
        </CardFooter>
      </Card>
    </div>
  )
}
