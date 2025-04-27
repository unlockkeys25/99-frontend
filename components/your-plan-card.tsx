"use client"

import { CalendarIcon, Clock, MapPin, Edit, Trash2, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface YourPlanCardProps {
  plan: {
    id: string
    activity: string
    date: Date
    time: string
    location: string
    mood: string
    rsvps: {
      countMeIn: number
      thinkICan: number
      stillThinking: number
    }
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function YourPlanCard({ plan, onEdit, onDelete }: YourPlanCardProps) {
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

  const totalRsvps = plan.rsvps.countMeIn + plan.rsvps.thinkICan + plan.rsvps.stillThinking

  // Format date to display
  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-background hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 flex flex-row justify-between items-start">
        <h3 className="font-medium text-lg text-foreground">{plan.activity}</h3>
        <div className="flex flex-wrap gap-1">
          {plan.mood.split(", ").map((singleMood, index) => {
            const moodKey = singleMood.trim() as keyof typeof moodColors
            return (
              <Badge key={index} className={cn("rounded-full text-xs", moodColors[moodKey] || "bg-primary/20")}>
                <span className="mr-1">{moodEmojis[moodKey] || "✨"}</span>
                {singleMood.replace("-", " ")}
              </Badge>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-2 text-sm text-sage-600">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-sage-400" />
            <span>{formatDate(plan.date)}</span>
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
              {totalRsvps} {totalRsvps === 1 ? "response" : "responses"}: {plan.rsvps.countMeIn} confirmed,{" "}
              {plan.rsvps.thinkICan} maybe
            </span>
          </div>
        </div>

        <div className="mt-3 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-full border-sage-200 text-sage-700 hover:bg-sage-50"
            onClick={() => onEdit(plan.id)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-full border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={() => onDelete(plan.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
