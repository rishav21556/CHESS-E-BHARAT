import { AuthGuard } from "@/components/auth-guard"
import { DashboardContent } from "./dashboard-content"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
