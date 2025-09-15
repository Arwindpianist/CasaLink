import { CondosSkeleton } from "@/components/admin/condos-skeleton"
import { AdminLoadingLayout } from "@/components/admin/admin-loading-layout"

export default function CondosLoading() {
  return (
    <AdminLoadingLayout>
      <CondosSkeleton />
    </AdminLoadingLayout>
  )
}