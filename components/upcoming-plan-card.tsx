"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock } from "lucide-react"

type RsvpStatus = "count-me-in" | "think-i-can" | "still-thinking"

interface UpcomingPlanCardProps {
  plan: {
    id: string
    activity: string
    host: string
    date: string
    time: string
    location: string
    mood: string
    rsvpStatus: RsvpStatus
  }
  onChangeRsvp?: (id: string) => void
}

export function UpcomingPlanCard({ plan, onChangeRsvp }: UpcomingPlanCardProps) {
  const router = useRouter()

  // Get the emoji for the current RSVP status
  const getRsvpEmoji = (status: RsvpStatus) => {
    switch (status) {
      case "count-me-in":
        return "✅"
      case "think-i-can":
        return "🤔"
      case "still-thinking":
        return "💭"
      default:
        return ""
    }
  }

  const handleChangeRsvp = () => {
    if (onChangeRsvp) {
      onChangeRsvp(plan.id)
    } else {
      router.push("/events")
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-background hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          {/* Plan Title */}
          <h3 className="font-semibold text-lg text-foreground">{plan.activity}</h3>

          {/* RSVP Status Icon */}
          <span className="text-sm">{getRsvpEmoji(plan.rsvpStatus)}</span>
        </div>

        {/* Date and Time + Change RSVP link */}
        <div className="flex justify-between items-center mt-1">
          <div className="text-sm text-sage-600 flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 mr-1 text-sage-400" />
            <span>{plan.date}</span>
            <Clock className="h-3.5 w-3.5 ml-3 mr-1 text-sage-400" />
            <span>{plan.time}</span>
          </div>

          <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto" onClick={handleChangeRsvp}>
            Change RSVP
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
