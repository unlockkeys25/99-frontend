import { CalendarIcon, Clock, MapPin, User, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PlanChatHeaderProps {
  plan: {
    activity: string
    description?: string
    date: string
    time: string
    location: string
    host: string
    mood: string
    expiresAt: Date
    participants: Array<{
      id: string
      name: string
      avatar?: string
      rsvpStatus: "count-me-in" | "think-i-can"
    }>
  }
  isExpired: boolean
}

// Add null checks to prevent errors
export function PlanChatHeader({ plan, isExpired }: PlanChatHeaderProps) {
  if (!plan) return null

  const moodColors: Record<string, string> = {
    chill: "bg-primary/20 text-primary-foreground",
    social: "bg-secondary/20 text-secondary-foreground",
    "deep-talk": "bg-tertiary/20 text-tertiary-foreground",
    reflective: "bg-accent/20 text-accent-foreground",
    "low-energy": "bg-muted text-muted-foreground",
    open: "bg-amber-100 text-amber-800",
  }

  const moodEmojis: Record<string, string> = {
    chill: "😌",
    social: "🎉",
    "deep-talk": "💬",
    reflective: "🧠",
    "low-energy": "😴",
    open: "🤔",
  }

  // Calculate time left until expiry
  const getTimeLeft = () => {
    if (isExpired || !plan.expiresAt) return "Expired"

    const now = new Date()
    const diffMs = plan.expiresAt.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m left`
    } else {
      return `${diffMins}m left`
    }
  }

  // Count participants by RSVP status with null checks
  const participants = plan.participants || []
  const countMeInCount = participants.filter((p) => p.rsvpStatus === "count-me-in").length
  const thinkICanCount = participants.filter((p) => p.rsvpStatus === "think-i-can").length
  const isOneOnOne = participants.length === 2

  return (
    <div className="bg-white p-4 shadow-sm border-b border-sage-100">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-medium text-sage-900">{plan.activity}</h2>
        <div className="flex flex-wrap gap-2 mt-1">
          {(plan.mood || "").split(", ").map((singleMood, index) => {
            const moodKey = singleMood.trim() as keyof typeof moodColors
            return (
              <Badge key={index} className={cn("rounded-full", moodColors[moodKey] || "bg-primary/20")}>
                <span className="mr-1">{moodEmojis[moodKey] || "✨"}</span>
                {singleMood.replace("-", " ")}
              </Badge>
            )
          })}
        </div>
      </div>
      {plan.description && <p className="text-sm text-sage-600 mt-1 mb-3">{plan.description}</p>}

      <div className="space-y-2 text-sm text-sage-600">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-sage-400" />
          <span>Hosted by {plan.host}</span>
        </div>

        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-sage-400" />
          <span>{plan.date}</span>
          <Clock className="h-4 w-4 ml-3 mr-2 text-sage-400" />
          <span>{plan.time}</span>
        </div>

        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-sage-400" />
          <span>{plan.location}</span>
        </div>

        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-sage-400" />
          <span>
            {isOneOnOne
              ? "1-on-1 chat with host"
              : `${participants.length} participants: ${countMeInCount} confirmed, ${thinkICanCount} maybe`}
          </span>
        </div>

        <div className="mt-2 text-xs text-sage-500 italic">
          This conversation is just for people attending this plan.
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-xs",
            isExpired ? "border-rose-200 text-rose-600 bg-rose-50" : "border-amber-200 text-amber-600 bg-amber-50",
          )}
        >
          <Clock className="h-3 w-3 mr-1" />
          {getTimeLeft()}
        </Badge>
      </div>
    </div>
  )
}
