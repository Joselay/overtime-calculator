import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth"
import { getOvertimeStats } from "@/lib/db/queries"
import { getOvertimeEntries } from "@/lib/actions"

export default async function Page() {
  const currentUser = await getCurrentUser()
  const overtimeStats = await getOvertimeStats()
  const overtimeEntries = await getOvertimeEntries()

  // Transform user data to match AppSidebar expectations
  const user = currentUser
    ? {
        name: currentUser.username,
        email: currentUser.email || currentUser.username,
        avatar: currentUser.avatar || "/avatars/default.jpg",
      }
    : null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards stats={overtimeStats} />
              <DataTable data={overtimeEntries} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
