import { AdminDashboardSkeleton } from "@/components/admin/admin-dashboard-skeleton"
import { AdminLoadingLayout } from "@/components/admin/admin-loading-layout"

export default function AdminLoading() {
  return (
    <AdminLoadingLayout>
      <AdminDashboardSkeleton />
    </AdminLoadingLayout>
  )
}
