import { SessionManagement } from "@/components/session-management"

export default function SessionsPage() {
  return (
    <div className="container mx-auto py-6">
      <SessionManagement userId="current-user-id" />
    </div>
  )
}
