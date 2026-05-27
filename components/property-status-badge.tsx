import { Badge } from "@/components/ui/badge"
import type { PropertyStatus } from "@/lib/property-data"
import { CheckCircle, Clock, XCircle } from "lucide-react"

interface PropertyStatusBadgeProps {
  status: PropertyStatus
}

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  const variants = {
    approved: {
      variant: "default" as const,
      icon: CheckCircle,
      label: "Approved",
      className: "bg-success text-white",
    },
    pending: {
      variant: "secondary" as const,
      icon: Clock,
      label: "Pending",
      className: "bg-warning text-white",
    },
    rejected: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Rejected",
      className: "bg-destructive text-destructive-foreground",
    },
  }

  const { icon: Icon, label, className } = variants[status]

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  )
}
