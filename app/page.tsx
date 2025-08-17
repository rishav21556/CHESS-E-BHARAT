import { AuthGuard } from "@/components/auth-guard"
import { DashboardContent } from "@/app/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
